import datetime
from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models
from geofeatures.models import Location


def AgeValidator(birth):
    age = relativedelta(datetime.datetime.now(), birth).years
    if age < 18:
        raise ValidationError('User is underage')
    if age > 80:
        raise ValidationError('User is too old')


def NotFuture(enroll_date):
    if datetime.datetime.now() < enroll_date:
        raise ValidationError('Can enroll in the future')


class Organization(models.Model):
    name = models.CharField(max_length=100, default=False)

    class Meta:
        ordering = ['name']


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='img/profile/%Y', default="img/blank_profile.png")
    subscribe_date = models.DateTimeField(validators=[NotFuture], auto_now_add=True)
    location = models.ForeignKey(Location, null=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['subscribe_date']


class Consumer(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    experience = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(1000)])
    # followers = models.ManyToManyField("self")
    # birth = models.DateField(default=False, validators=[AgeValidator, NotFuture])

    # Could be useful
    # is_oauth = models.BooleanField(default=False)

    @property
    def experience_level(self):
        return self.experience / 10


class Analyst(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, null=True, on_delete=models.SET_NULL)
