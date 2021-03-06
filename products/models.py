from django.contrib.gis.db import models
from profiles.models import Consumer
from crowd_price.const import *


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Store(models.Model):
    picture = models.ImageField(upload_to='stores/%Y', default='stores/blank_store.png')
    name = models.CharField(max_length=50)
    pnt = models.PointField(srid=SRID)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        unique_together = ('name', 'pnt')


class Product(models.Model):
    name = models.CharField(max_length=50, unique=True)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
