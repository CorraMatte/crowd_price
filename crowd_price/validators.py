import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError


def AgeValidator(birth):
    age = relativedelta(datetime.datetime.now(), birth).years
    if age < 18:
        raise ValidationError('User is underage')
    if age > 80:
        raise ValidationError('User is too old')


def NotFuture(enroll_date):
    if datetime.datetime.now() < enroll_date:
        raise ValidationError('Can enroll in the future')