import datetime
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models
from dateutil.relativedelta import relativedelta


def AgeValidator(birth):
    age = relativedelta(datetime.datetime.now(), birth).years
    if age < 18:
        raise ValidationError('User is underage')
    if age > 80:
        raise ValidationError('User is too old')


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(max_length=50, default=False)
    city = models.CharField(max_length=100, default=False)
    country = models.CharField(max_length=100, default=False)
    address = models.CharField(max_length=100, default=False)

    tel_number = models.CharField(max_length=20, null=True, default=None)
    birth = models.DateField(default=False, validators=[AgeValidator])


class NormalUser(models.Model):


    experience = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(1000)])
    @property
    def short_description(self):
        if self.description:
            return "%s..." % self.description[:20]


class Analyst(models.Model):
    user = models.OneToOneField(Profile, on_delete=models.CASCADE)
