import csv
import datetime
from io import StringIO
from capabilities.models import Report
from capabilities.utils import get_dump_fieldnames
from rest_framework.test import APITestCase
from rest_framework import status
from products.models import Store, Product, Category
from profiles.models import Consumer, Organization
from django.contrib.gis.geos import GEOSGeometry
from crowd_price.const import SRID
from pytz import timezone


# Create your tests here.
class ReportTests(APITestCase):
    def setUp(self):
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com"
        }
        self.client.post('/consumer/signup', data=user)
        self.token = self.client.post(
            '/user/login', data={'email': 'test.email@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

        cat = Category(name='category')
        cat.save()
        cat = Category(name='category2')
        cat.save()
        p = Product(name='product')
        p.save()
        p.categories.set([Category.objects.all()[0]])
        p.save()
        store = Store(name='store', pnt=GEOSGeometry('POINT(0 0)', srid=SRID))
        store.save()

    """
        Test report creation
        path('report/add', views.CreateConsumerView.as_view()),
    """
    def test_if_store_or_pnt_are_present(self):
        url = '/report/add'
        report = {"product": Product.objects.all()[0].pk, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'}
        response = self.client.post(url, data=report)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report.pop('pnt')
        report['store'] = Store.objects.get().pk
        response = self.client.post(url, data=report)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report.pop('store')
        response = self.client.post(url, data=report)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_if_experience_is_acquired(self):
        url = '/report/add'
        user = Consumer.objects.get().profile.user
        experience_pre = Consumer.objects.get(profile__user__email=user.email).experience

        report = {"product": Product.objects.all()[0].pk, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'}
        self.client.post(url, data=report)
        experience_post = Consumer.objects.get(profile__user__email=user.email).experience
        self.assertEqual(experience_pre + 1, experience_post)

    def test_get_newer_reports(self):
        url = '/reports/newer'
        report = {"product": Product.objects.all()[0].pk, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'}
        self.client.post('/report/add', data=report)
        self.client.post('/report/add', data=report)
        response = self.client.get(url).json()['results']['features']

        # The last inserted (higher pk) is returned before the other one
        self.assertGreater(response[0]['id'], response[1]['id'])


class SearchTest(APITestCase):
    def setUp(self):
        super().setUp()
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com"
        }
        self.client.post('/consumer/signup', data=user)
        self.token = self.client.post(
            '/user/login', data={'email': 'test.email@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        c = Consumer.objects.all()[0]
        cat = Category(name='category')
        cat.save()
        cat = Category(name='category2')
        cat.save()
        p = Product(name='product')
        p.save()
        p.categories.set([Category.objects.all()[0]])
        p.save()
        p = Product(name='product2')
        p.save()
        p.categories.set(Category.objects.all())
        p.save()
        p = Product(name='product3')
        p.save()
        p.categories.set([Category.objects.all()[1]])
        p.save()
        r = Report(product=Product.objects.all()[0], price=10, pnt='POINT(-100.0208 44.0489)', consumer=c)
        r.save()
        r = Report(product=Product.objects.all()[1], price=50, pnt='POINT(-100.0208 44.0489)', consumer=c)
        r.save()
        r = Report(product=Product.objects.all()[2], price=100, pnt='POINT(-100.0208 44.0489)', consumer=c)
        r.save()

    def test_generic_search_api_create_and_result(self):
        search = {"product_query": "product"}
        response = self.client.post('/reports/search', data=search)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        json_response = response.json()
        self.assertEqual(len(json_response['features']), len(Report.objects.all()))

    def test_category_search_api_result(self):
        search = {"product_query": "product", "categories": [Category.objects.all()[0].pk]}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(product__categories__in=[Category.objects.all()[0].pk])))

        search = {"product_query": "product", "categories": [Category.objects.all()[1].pk]}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(product__categories__in=[Category.objects.all()[1].pk])))

        search = {"product_query": "product", "categories": [c.pk for c in Category.objects.all()]}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(product__categories__in=[c.pk for c in Category.objects.all()])))

    def test_price_search_api_result(self):
        search = {"product_query": "product", "price_min": 50}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(price__gte=50)))
        search = {"product_query": "product", "price_min": 100}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(price__gte=100)))
        search = {"product_query": "product", "price_max": 50}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(price__lte=50)))
        search = {"product_query": "product", "price_max": 100}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(price__lte=100)))

    def test_after_date_search_api_result(self):
        now = timezone('Europe/Rome').localize(datetime.datetime.now())
        str_now = now.strftime("%Y-%m-%dT%H:%M:%S%z")
        for rep in Report.objects.all():
            rep.created_time = now - datetime.timedelta(minutes=1)
            rep.save()

        search = {"product_query": "product", 'after_date': str_now}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(
            created_time__gte=now
        )))

        str_now_minus_30 = (now - datetime.timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%S")
        search = {"product_query": "product", 'after_date': str_now_minus_30}
        response = self.client.post('/reports/search', data=search).json()
        self.assertEqual(len(response['features']), len(Report.objects.filter(created_time__gte=now - datetime.timedelta(days=30))))

    def test_distance_search_api_result(self):
        raise NotImplemented('to implement')


class DumpTests(APITestCase):
    def setUp(self):
        super().setUp()
        self.url = '/reports/dump'
        org = Organization(name='Org')
        org.save()
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "organization": org.pk
        }
        self.client.post('/analyst/signup', data=user)

        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.consumer@gmail.com"
        }
        self.client.post('/consumer/signup', data=user)
        self.token = self.client.post(
            '/user/login', data={'email': 'test.consumer@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

        c = Consumer.objects.all()[0]
        cat = Category(name='category')
        cat.save()
        p = Product(name='product')
        p.save()
        p.categories.set(Category.objects.all())
        p.save()
        r = Report(product=p, price=22.12, pnt='POINT(-100.0208 44.0489)', consumer=c)
        r.save()

        self.token = self.client.post(
            '/user/login', data={'email': 'test.email@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

    def test_csv_dump(self):
        search = {"product_query": "product", "pnt": 'POINT(-100.0208 44.0489)', "categories": [1]}
        self.client.post('/reports/search', data=search)
        dump = {"export_format": "csv"}
        response = self.client.post(self.url, data=dump)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response._headers['content-type'][1], 'text/csv')
        csv_str = StringIO(response.content.decode())
        reader = csv.DictReader(csv_str, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL, fieldnames=get_dump_fieldnames())
        next(reader)
        lines = []
        for r in reader:
            lines.append(r)
        self.assertEqual(len(Report.objects.all()), len(lines))

    def test_json_dump(self):
        search = {"product_query": "product", "pnt": 'POINT(-100.0208 44.0489)'}
        self.client.post('/reports/search', data=search)
        dump = {"export_format": "json"}
        response = self.client.post(self.url, data=dump)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response._headers['content-type'][1], 'application/json; charset=utf8')
        self.assertEqual(len(Report.objects.all()), len(response.json()))

    def test_excel_dump(self):
        search = {"product_query": "product", "pnt": 'POINT(-100.0208 44.0489)'}
        self.client.post('/reports/search', data=search)
        dump = {"export_format": "xls"}
        response = self.client.post(self.url, data=dump)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response._headers['content-type'][1], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
