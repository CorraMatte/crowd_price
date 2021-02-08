from django.test import TestCase
from rest_framework import status
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
        Check user constraints
        path('consumer/add', views.CreateConsumerView.as_view()),
    """
    def test_duplicate_email_for_user(self):
        url = '/consumer/add'
        user = {
            "username": "user",
            "password1": "P4sswordVeryS€cure@", "password2": "P4sswordVeryS€cure@",
            "email": "corra.matteo@gmail.com",
            "pnt": {
                "type": "Point",
                "coordinates": [-100.0208, 44.0489]
            }
        }
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user['username'] = 'new_user_same_email'
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_email_characters_validators(self):
        url = '/consumer/add'
        user = {
            "username": "Us3rUs3r!",
            "password1": "Us3rUs3r!", "password2": "Us3rUs3r!",
            "email": "corra.matteo@gmail.com",
            "pnt": {
                "type": "Point",
                "coordinates": [-100.0208, 44.0489]
            }
        }
        response = self.client.post(url, data=user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'are', 'different'
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'Moresecurenotenough'
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'Moresecurenotenough!'
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user['password1'] = user['password2'] = 'S3cureenough!'
        self.assertEqual(response.status_code, status.HTTP_200_OK)
