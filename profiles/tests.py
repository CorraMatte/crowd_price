from django.test import TestCase
from profiles.models import AgeValidator, NotFuture
import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError


# Create your tests here.
class OwnerMethodTest(TestCase):
    """
    Check if the user is underage or too old
    """
    def test_if_the_user_is_underage_or_too_old(self):
        now = datetime.datetime.now()
        too_young = now - relativedelta(years=16)
        too_old = now - relativedelta(years=90)

        with self.assertRaises(ValidationError):
            AgeValidator(too_young)

        with self.assertRaises(ValidationError):
            AgeValidator(too_old)

    """
    Check if the user is underage or too old
    """
    def test_if_date_is_future(self):
        with self.assertRaises(ValidationError):
            NotFuture(datetime.datetime.now() + datetime.timedelta(days=1))
