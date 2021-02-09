from django.test import TestCase
from rest_framework import status
from products.models import Category


# Create your tests here.
class CategoryTests(TestCase):
    """
        Check if it gives an error for a duplicate category
        path('category/add', views.CreateCategoryView.as_view()),
    """
    def test_category_duplicate_name(self):
        url = '/category/add'
        response = self.client.post(url, data={'name': 'category'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(url, data={'name': 'category'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProductTests(TestCase):
    def setUp(self):
        response_cat = self.client.post('/category/add', data={'name': 'category'})

    """
        Check if it gives an error for a duplicate product
        path('product/add', views.CreateCategoryView.as_view()),
    """
    def test_product_duplicate_name(self):
        url = '/product/add'
        response = self.client.post(url, data={'name': 'product', 'categories': [Category.objects.get().pk]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(url, data={'name': 'product', 'categories': [Category.objects.get().pk]})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """
        Check if it gives for a not existing category
        path('category/<int:pk>/products', views.RetrieveCategoryProductView.as_view()),
    """
    def test_retrieve_products_by_category(self):
        url = '/category/{}/products'
        self.client.post('/product/add', data={'name': 'product', 'categories': [Category.objects.get().pk]})

        response = self.client.get(url.format(Category.objects.get().pk))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url.format('not_existing_cat'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
