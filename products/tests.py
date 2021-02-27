from rest_framework import status
from rest_framework.test import APITestCase
from products.models import Category, Product


class CategoryTests(APITestCase):
    def setUp(self):
        super().setUp()
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post('/consumer/signup', data=user)
        self.token = self.client.post(
            '/user/login', data={'email': 'test.email@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

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


class ProductTests(APITestCase):
    def setUp(self):
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post('/consumer/signup', data=user)
        self.token = self.client.post(
            '/user/login', data={'email': 'test.email@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        cat = Category(name='category3')
        cat.save()
        p = Product(name='new_product')
        p.save()
        p.categories.set([Category.objects.all()[0]])
        p.save()

    """
        Check if it gives an error for a duplicate product
        path('product/add', views.CreateCategoryView.as_view()),
    """

    def test_product_duplicate_name(self):
        url = '/product/add'
        cat = Category(name='new_category')
        cat.save()
        response = self.client.post(url, data={'name': 'product', 'categories': [Category.objects.all()[0].pk]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(url, data={'name': 'product', 'categories': [Category.objects.all()[0].pk]})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """
        Check if it gives for a not existing category
        path('category/<int:pk>/products', views.RetrieveCategoryProductView.as_view()),
    """

    def test_retrieve_products_by_category(self):
        url = '/products/category/{}'
        response = self.client.get(url.format(Category.objects.all()[0].pk))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(url.format('not_existing_cat'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
