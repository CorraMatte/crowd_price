from django.db import models
from profiles.models import Profile, Analyst, ConsumerUser
from products.models import Product, Store
from geofeatures.models import Location


# Create your models here.
class Search(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    is_starred = models.BooleanField(default=False)
    is_monitoring = models.BooleanField(default=False)
    # Filters...


class Format(models.TextChoices):
    TXT = 'txt', 'Text'
    CSV = 'csv', 'CSV'
    JSON = 'json', 'Json'
    EXCEL = 'excel', 'Excel'


class Dump(models.Model):
    search = models.ForeignKey(Search, null=True, on_delete=models.SET_NULL)
    download_timestamp = models.DateTimeField(auto_now_add=True)
    export_format = models.CharField(max_length=10, choices=Format.choices, default=Format.CSV)


class Report(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(ConsumerUser, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, null=True, on_delete=models.SET_NULL)

    price = models.DecimalField(max_digits=6, decimal_places=2)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
