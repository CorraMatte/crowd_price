from django.contrib.auth.models import User
from crowd_price.validators import *
from crowd_price.const import *
from django.core.validators import MaxValueValidator, validate_image_file_extension
from django.contrib.gis.db import models


class Organization(models.Model):
    name = models.CharField(max_length=100, default=False)

    class Meta:
        ordering = ['name']


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='profiles/%Y', default="profiles/blank_profile.png")
    subscribe_date = models.DateTimeField(validators=[NotFuture], auto_now_add=True)

    def __str__(self):
        return self.user.email

    class Meta:
        ordering = ['user__email']


class Consumer(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    experience = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(MAX_EXPERIENCE)])

    # Could be useful
    # is_oauth = models.BooleanField(default=False)

    def __str__(self):
        return self.profile.user.email

    @property
    def experience_level(self):
        return self.experience / 10

    class Meta:
        ordering = ['profile__user__email']


class Analyst(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, null=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ['profile__user__email']

    def __str__(self):
        return self.profile.user.email
