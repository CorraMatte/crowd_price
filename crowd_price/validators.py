import datetime
from django.core.exceptions import ValidationError
from pytz import timezone


def NotFuture(enroll_date):
    if timezone('Europe/Rome').localize(datetime.datetime.now()) < enroll_date:
        raise ValidationError('Can enroll in the future')
