from pytz import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from crowd_price.validators import NotFuture
import datetime
from django.core.exceptions import ValidationError


class ValidationTest(APITestCase):
    """
         Check if the date is from future
    """

    def test_if_date_is_future(self):
        with self.assertRaises(ValidationError):
            NotFuture(timezone('Europe/Rome').localize(datetime.datetime.now() + datetime.timedelta(days=1)))


class UserTests(APITestCase):
    """
        Test error for duplicate users, no need a test for the analyst part
        path('consumer/signup', views.CreateConsumerView.as_view()),
    """

    def test_duplicate_email_for_user(self):
        url = '/consumer/signup'
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com"
        }
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user['username'] = 'new_user_same_email'
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """
        Test password change
    """
    def test_password_change_for_user(self):
        url = '/consumer/signup'
        user = {
            "username": "user", "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "test.email@gmail.com"
        }
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.token = self.client.post(
            '/user/login', data={'email': 'test.email@gmail.com', 'password': 'P4sswordVeryS€cure@'}
        ).json()['key']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

        url = '/user/update/password'
        new_creds = {
            'new_password1': 'S3cureenough!',
            'new_password2': 'S3cureenough!',
            'old_password': 'this is a wrong password!'
        }
        response = self.client.put(url, data=new_creds)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        new_creds['old_password'] = 'P4sswordVeryS€cure@'
        new_creds['new_password1'] = new_creds['new_password2'] = 'are', 'different'
        response = self.client.put(url, data=new_creds)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        new_creds['new_password1'] = new_creds['new_password2'] = 'Moresecurenotenough'
        response = self.client.put(url, data=new_creds)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        new_creds['new_password1'] = new_creds['new_password2'] = 'Moresecurenotenough!'
        response = self.client.put(url, data=new_creds)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        new_creds['new_password1'] = new_creds['new_password2'] = 'S3cureenough!'
        response = self.client.put(url, data=new_creds)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    """
        Test password strength and the validators, no need a test for the analyst part
        path('consumer/signup', views.CreateConsumerView.as_view()),
    """

    def test_email_password_characters_validators(self):
        url = '/consumer/signup'
        user = {
            "username": "UserVerySecure", "password1": "test.email@gmail.com", "password2": "test.email@gmail.com",
            "email": "test.email@gmail.com"
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

    """
        Test login of the user, in order to check for a valid token
        path('user/login', views.LoginAPI.as_view()),
    """

    def test_login_signup_check_response_token(self):
        url = '/consumer/signup'
        user = {
            "username": "UserVerySecure", "password1": "P3sswordVeryS€cure@", "password2": "P3sswordVeryS€cure@",
            "email": "test.email@gmail.com"
        }
        self.client.post(url, data=user)
        url = '/user/login'
        user = {"password": "P3sswordVeryS€cure@", "email": "test.email@gmail.com"}
        resp = self.client.post(url, data=user)
        self.assertTrue('key' in resp.json().keys())

    """
        Test return value for the user, if it is an analyst or a consumer
        path('user/login', views.LoginAPI.as_view()),
    """

    def test_login_type(self):
        url = '/consumer/signup'
        user = {
            "username": "UserVerySecure", "password1": "P2sswordVeryS€cure@", "password2": "P2sswordVeryS€cure@",
            "email": "test.consumer@gmail.com"
        }
        self.client.post(url, data=user)

        url = '/analyst/signup'
        user = {
            "username": "UserVerySecure", "password1": "P1sswordVeryS€cure@", "password2": "P1sswordVeryS€cure@",
            "email": "test.analyst@gmail.com"
        }
        self.client.post(url, data=user)
        url = '/user/login'
        user = {"password": "P1sswordVeryS€cure@", "email": "test.analyst@gmail.com"}
        _type = self.client.post(url, data=user).json()['type']
        self.assertEqual(_type, 'analyst')

        user = {"password": "P2sswordVeryS€cure@", "email": "test.consumer@gmail.com"}
        _type = self.client.post(url, data=user).json()['type']
        self.assertEqual(_type, 'consumer')
