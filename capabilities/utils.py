import csv
import json
from django.http.response import HttpResponse
from capabilities.models import Search, Report
from decimal import Decimal
from django.contrib.gis.measure import D
from copy import copy
from capabilities import serializers as serial
from excel_response import ExcelResponse
from profiles.models import Consumer
from products.models import Product, Store


def get_reports_by_search(search_pk):
    search = Search.objects.get(pk=search_pk)
    if not search:
        return []

    reports = Report.objects.filter(
        price__gte=Decimal(search.price_min), price__lte=Decimal(search.price_max),
        created_time__gte=search.after_date
    )

    if search.categories.all():
        reports = reports.filter(product__categories__in=search.categories.all())

    # if search.pnt:
    #     reports = reports.filter(pnt__distance_lte=(search.pnt, D(km=search.distance)))

    return reports.order_by(search.ordering_by)


def get_serial_reports_by_search(search_pk):
    reports = get_reports_by_search(search_pk)
    serial_prods = serial.ReportSerializer(reports, many=True).data
    return serial_prods


def get_dump_fieldnames():
    fields = copy(serial.ReportSerializer.Meta.fields)
    fields.remove('pnt')
    fields.extend(['latitude', 'longitude'])
    return fields


def cast_features_results(reports):
    res = []
    for r in reports['features']:
        geo = r['geometry']
        r = r['properties']
        if geo is not None:
            r['latitude'] = geo['coordinates'][0]
            r['longitude'] = geo['coordinates'][1]
        else:
            r['store'] = Store.objects.get(pk=r['store']).name

        r['product'] = Product.objects.get(pk=r['product']).name
        r['consumer'] = Consumer.objects.get(pk=r['consumer']).profile.user.email

        res.append(r)
    return res


# https://docs.djangoproject.com/en/3.1/howto/outputting-csv/
def get_dump_csv(search_pk, filename):
    reports, fieldnames = get_serial_reports_by_search(search_pk), get_dump_fieldnames()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    writer = csv.DictWriter(response, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL, fieldnames=fieldnames)
    writer.writeheader()
    results = cast_features_results(reports)
    writer.writerows(results)

    return response


def get_dump_json(search_pk, filename):
    reports, fieldnames = get_serial_reports_by_search(search_pk), get_dump_fieldnames()
    response = HttpResponse(content_type='application/json; charset=utf8')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.writelines(json.dumps(cast_features_results(reports)))

    return response


# https://pypi.org/project/django-excel-response/
# https://docs.djangoproject.com/en/3.1/howto/outputting-pdf/
def get_dump_excel(search_pk, filename):
    return ExcelResponse(
        cast_features_results(get_serial_reports_by_search(search_pk)), output_filename=filename, worksheet_name='reports'
    )
