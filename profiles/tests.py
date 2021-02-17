from rest_framework import status
from rest_framework.test import APITestCase
from crowd_price.validators import NotFuture #,AgeValidator
# from dateutil.relativedelta import relativedelta
import datetime
from django.core.exceptions import ValidationError


# Create your tests here.
class ValidationTest(APITestCase):
     """
         Check if the user is underage or too old
     """
     def test_if_date_is_future(self):
        with self.assertRaises(ValidationError):
            NotFuture(datetime.datetime.now() + datetime.timedelta(days=1))


class UserTests(APITestCase):
    """
        Test error for duplicate users
        path('consumer/signup', views.CreateConsumerView.as_view()),
    """
    def test_duplicate_email_for_user(self):
        url = '/consumer/signup'
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user['username'] = 'new_user_same_email'
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """
        Test password strength
        path('consumer/signup', views.CreateConsumerView.as_view()),
    """
    def test_email_characters_validators(self):
        url = '/consumer/signup'
        user = {
            "username": "UserVerySecure", "password1": "test.email@gmail.com", "password2": "test.email@gmail.com",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
            # {"type": "Point", "coordinates": [-100.0208, 44.0489]}
        }

        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'are', 'different'
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'Moresecurenotenough'
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'Moresecurenotenough!'
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'S3cureenough!'
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_signup(self):
        url = '/consumer/signup'
        user = {
            "username": "UserVerySecure", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        detail = self.client.post(url, data=user).json()['detail']
        self.assertEqual(detail['id'], 1)

        url = '/user/login'
        user = {"password": "P4sswordVeryS€cure@", "email": "test.email@gmail.com",}
        resp = self.client.post(url, data=user)
        self.assertTrue('key' in resp.json().keys())

    def test_login_type(self):
        url = '/consumer/signup'
        user = {
            "username": "UserVerySecure", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.consumer@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post(url, data=user)

        url = '/analyst/signup'
        user = {
            "username": "UserVerySecure", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.analyst@gmail.com", "pnt": 'POINT(-100.0208 44.0489)'
        }
        self.client.post(url, data=user)
        url = '/user/login'
        user = {"password": "P4sswordVeryS€cure@", "email": "test.analyst@gmail.com"}
        _type = self.client.post(url, data=user).json()['type']
        self.assertEqual(_type, 'analyst')

        user = {"password": "P4sswordVeryS€cure@", "email": "test.consumer@gmail.com"}
        _type = self.client.post(url, data=user).json()['type']
        self.assertEqual(_type, 'consumer')
