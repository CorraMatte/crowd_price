from django.contrib.gis.db import models
from profiles.models import Consumer
from geofeatures.models import Location


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_by = models.ForeignKey(Consumer, null=True, on_delete=models.SET_NULL)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Store(models.Model):
    picture = models.ImageField(upload_to='img/store/%Y', default='img/store_blank.png')
    name = models.CharField(max_length=50)
    # location = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        # unique_together = ('name', 'location')


class Product(models.Model):
    picture = models.ImageField(upload_to='img/products/%Y', default='img/product_blank.png')
    name = models.CharField(max_length=50, unique=True)
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
