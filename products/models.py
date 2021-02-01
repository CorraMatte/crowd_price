from django.db import models
from profiles.models import ConsumerUser
from geofeatures.models import Location


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)
    created_by = models.ForeignKey(ConsumerUser, null=True, on_delete=models.SET_NULL)
    created_time = models.DateTimeField(auto_now_add=True)


class Product(models.Model):
    picture = models.ImageField(upload_to='img/products/%Y', default='img/product_blank.png')
    name = models.CharField(max_length=50)
    categories = models.ManyToManyField(Category)


class Store(models.Model):
    picture = models.ImageField(upload_to='img/store/%Y', default='img/store_blank.png')
    name = models.CharField(max_length=50)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
