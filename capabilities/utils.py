import csv
import json
from copy import copy
from decimal import Decimal
from django.contrib.gis.measure import Distance as D
from django.contrib.gis.db.models.functions import Distance
from django.contrib.postgres.search import TrigramSimilarity
from django.http import HttpResponse
from excel_response import ExcelResponse
from capabilities import serializers as serial
from capabilities.models import Search, Report
from products.models import Product, Store
from profiles.models import Consumer
from profiles.utils import get_user_type


def get_reports_from_product_set(product_set, search, with_distance=True):
    reports = Report.objects.filter(
        price__gte=Decimal(search.price_min), price__lte=Decimal(search.price_max),
        created_time__gte=search.after_date, product__in=product_set
    )

    if search.categories.all():
        reports = reports.filter(product__categories__in=search.categories.all())

    if search.pnt:
        reports = reports.filter(pnt__distance_lte=(search.pnt, D(km=search.distance)))

    if with_distance:
        reports = reports.annotate(distance=Distance('pnt', search.pnt))

    return reports


# https://docs.djangoproject.com/en/3.1/ref/contrib/postgres/search/#trigramsimilarity
# https://docs.djangoproject.com/en/3.1/ref/contrib/postgres/search/#the-search-lookup
def get_reports_by_search(search_pk, with_distance=True):
    search = Search.objects.get(pk=search_pk)
    if not search:
        return []

    exact_reports = get_reports_from_product_set(
        Product.objects.filter(name__search=search.product_query), search, with_distance
    )

    # Check if the product_query is a pk
    if search.profile and get_user_type(search.profile.user) == 'analyst':
        try:
            p = [Product.objects.get(pk=search.product_query)]
            exact_reports = get_reports_from_product_set(p, search, with_distance)
        except (Product.DoesNotExist, ValueError):
            exact_reports = get_reports_from_product_set(
                Product.objects.filter(name__search=search.product_query), search, with_distance
            )

        reports = list(exact_reports.order_by(search.ordering_by))
    else:
        similar_reports = get_reports_from_product_set(Product.objects.annotate(
                similarity=TrigramSimilarity('name', search.product_query)
        ).filter(similarity__gt=0.2), search, with_distance).difference(exact_reports)
        reports = list(exact_reports.order_by(search.ordering_by)) + list(similar_reports.order_by(search.ordering_by))

    return reports


def get_serial_reports_by_search(search_pk, with_distance=True):
    reports = get_reports_by_search(search_pk, with_distance)
    serial_reports = serial.ReportSerializer(reports, many=True).data

    if with_distance:
        for index, r in enumerate(serial_reports['features']):
            r['properties'].update({'distance': int(reports[index].distance.km)})

    return serial_reports


def get_dump_fieldnames():
    fields = copy(serial.ReportSerializer.Meta.fields)
    fields.remove('pnt')
    fields.extend(['latitude', 'longitude'])
    return fields


def cast_features_results(reports):
    res = []
    for r in reports['features']:
        geo = r['geometry']
        r = {**{'id': r['id']}, **r['properties']}

        if geo is not None:
            r['latitude'] = geo['coordinates'][0]
            r['longitude'] = geo['coordinates'][1]

        if r['store']:
            r['store'] = r['store']['name']

        r['product'] = Product.objects.get(pk=r['product']['id']).name
        r['consumer'] = Consumer.objects.get(pk=r['consumer']['id']).profile.user.email

        res.append(r)
    return res


# https://docs.djangoproject.com/en/3.1/howto/outputting-csv/
def get_dump_csv(search_pk, filename):
    reports, fieldnames = get_serial_reports_by_search(search_pk, False), get_dump_fieldnames()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    writer = csv.DictWriter(response, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL, fieldnames=fieldnames)
    writer.writeheader()
    results = cast_features_results(reports)
    writer.writerows(results)

    return response


def get_dump_json(search_pk, filename):
    reports, fieldnames = get_serial_reports_by_search(search_pk, False), get_dump_fieldnames()
    response = HttpResponse(content_type='application/json; charset=utf8')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.writelines(json.dumps(cast_features_results(reports)))

    return response


# https://pypi.org/project/django-excel-response/
# https://docs.djangoproject.com/en/3.1/howto/outputting-pdf/
def get_dump_excel(search_pk, filename):
    return ExcelResponse(
        cast_features_results(get_serial_reports_by_search(search_pk, False)), output_filename=filename,
        worksheet_name='reports'
    )
