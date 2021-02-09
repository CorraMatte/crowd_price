from django.test import TestCase
from rest_framework import status

from crowd_price.const import SRID
from crowd_price.validators import NotFuture #,AgeValidator
# from dateutil.relativedelta import relativedelta
import datetime
from django.core.exceptions import ValidationError


# Create your tests here.
class ValidationTest(TestCase):
#     """
#         Check if the user is underage or too old
#     """
#     def test_if_the_user_is_underage_or_too_old(self):
#         now = datetime.datetime.now()
#         too_young = now - relativedelta(years=16)
#         too_old = now - relativedelta(years=90)
#
#         with self.assertRaises(ValidationError):
#             AgeValidator(too_young)
#
#         with self.assertRaises(ValidationError):
#             AgeValidator(too_old)
#
#     """
#         Check if the user is underage or too old
#     """
    def test_if_date_is_future(self):
        with self.assertRaises(ValidationError):
            NotFuture(datetime.datetime.now() + datetime.timedelta(days=1))


class UserTests(TestCase):
    """
        Test error for duplicate users
        path('consumer/add', views.CreateConsumerView.as_view()),
    """
    def test_duplicate_email_for_user(self):
        url = '/consumer/add'
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
        path('consumer/add', views.CreateConsumerView.as_view()),
    """
    def test_email_characters_validators(self):
        url = '/consumer/add'
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
