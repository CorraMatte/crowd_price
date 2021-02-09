import csv
from io import StringIO
from capabilities.models import Report
from capabilities.utils import get_dump_fieldnames
from django.test import TestCase
from rest_framework import status
from products.models import Store
from profiles.models import Consumer
from django.contrib.gis.geos import GEOSGeometry
from crowd_price.const import SRID


# Create your tests here.
class ReportTests(TestCase):
    def setUp(self):
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post('/consumer/add', data=user)
        self.client.post('/category/add', data={'name': 'category'})
        self.client.post('/product/add', data={'name': 'product', 'categories': [1]})

    """
        Test report creation
        path('report/add', views.CreateConsumerView.as_view()),
    """
    def test_if_store_or_pnt_are_present(self):
        url = '/report/add'
        report = {
            "product": 1, "consumer": 1, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'
        }
        response = self.client.post(url, data=report)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report.pop('pnt')
        store = Store(name='store', pnt=GEOSGeometry('POINT(0 0)', srid=SRID))
        store.save()
        report['store'] = store.pk
        response = self.client.post(url, data=report)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        report.pop('store')
        response = self.client.post(url, data=report)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_if_experience_is_aquired(self):
        url = '/report/add'
        user = Consumer.objects.get().profile.user
        experience_pre = Consumer.objects.get(profile__user__email=user.email).experience

        report = {
            "product": 1, "consumer": 1, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post(url, data=report)
        experience_post = Consumer.objects.get(profile__user__email=user.email).experience
        self.assertEqual(experience_pre + 1, experience_post)

    def test_get_newer_reports(self):
        url = '/reports/newer'
        report = {
            "product": 1, "consumer": 1, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post('/report/add', data=report)
        self.client.post('/report/add', data=report)
        response = self.client.get(url).json()['results']['features']

        # The last inserted (highe pk) is returned before the other one
        self.assertGreater(response[0]['properties']['pk'], response[1]['properties']['pk'])


class DumpTests(TestCase):
    def setUp(self):
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post('/consumer/add', data=user)
        self.client.post('/category/add', data={'name': 'category'})
        self.client.post('/product/add', data={'name': 'product', 'categories': [1]})
        report = {
            "product": 1, "consumer": 1, "price": 22.12, "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post('/report/add', data=report)

    def test_csv_dump(self):
        url = '/reports/dump'
        search = {
            "profile": 1, "product_query": "product", "pnt": 'POINT(-100.0208 44.0489)', "categories": [1]
        }
        # Search(profile=1, product_query="product", pnt= 'POINT(-100.0208 44.0489)', categories= [1])
        response = self.client.get('/reports/search', data=search)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        dump = {"search": 1, "export_format": "csv"}
        response = self.client.get(url, data=dump)
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
        url = '/reports/dump'
        search = {
            "profile": 1, "product_query": "product", "pnt": 'POINT(-100.0208 44.0489)', "categories": [1]
        }
        response = self.client.get('/reports/search', data=search)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        json_response = response.json()
        self.assertGreater(len(json_response['features']), 0)
        dump = {"search": 1, "export_format": "json"}
        response = self.client.get(url, data=dump)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response._headers['content-type'][1], 'application/json; charset=utf8')
        self.assertEqual(len(Report.objects.all()), len(response.json()))

    def test_excel_dump(self):
        url = '/reports/dump'
        search = {
            "profile": 1, "product_query": "product", "pnt": 'POINT(-100.0208 44.0489)', "categories": [1]
        }
        response = self.client.get('/reports/search', data=search)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        json_response = response.json()
        self.assertGreater(len(json_response['features']), 0)
        dump = {"search": 1, "export_format": "xls"}
        response = self.client.get(url, data=dump)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response._headers['content-type'][1], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
