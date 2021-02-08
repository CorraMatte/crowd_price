from django.test import TestCase
from rest_framework import status


# Create your tests here.
class CategoryTests(TestCase):
    # path('category/add', views.CreateCategoryView.as_view()),
    def test_category_duplicate_name(self):
        url = '/category/add'
        response = self.client.post(url, data={'name': 'category'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(url, data={'name': 'category'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProductTests(TestCase):
    # path('product/add', views.CreateCategoryView.as_view()),
    def test_product_duplicate_name(self):
        url = '/product/add'
        response_cat = self.client.post('/category/add', data={'name': 'category'})
        pk_cat = response_cat.json()['pk']
        response = self.client.post(url, data={'name': 'product', 'categories': [pk_cat]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(url, data={'name': 'product', 'categories': [pk_cat]})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # path('category/<int:pk>/products', views.RetrieveCategoryProductView.as_view()),
    def test_retrieve_products_by_category(self):
        url = '/category/{}/products'
        response_cat = self.client.post('/category/add', data={'name': 'category'})
        pk_cat = response_cat.json()['pk']
        self.client.post('/product/add', data={'name': 'product', 'categories': [pk_cat]})

        response = self.client.get(url.format(pk_cat))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url.format('not_existing_cat'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
