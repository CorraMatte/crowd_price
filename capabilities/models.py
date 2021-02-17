from django.contrib.gis.db import models
from crowd_price.const import *
from crowd_price.validators import NotFuture
from profiles.models import Profile, Analyst, Consumer
from products.models import Product, Store, Category
from django.core.validators import MaxValueValidator, MinValueValidator
from django.forms.models import model_to_dict
import datetime


class OrderBy(models.TextChoices):
    PRC_ASC = 'price', 'price ascending'
    PRC_DESC = '-price', 'price descending'
    TMP_ASC = 'created_time', 'created_time ascending'
    TMP_DESC = '-created_time', 'created_time descending'
    DIST_ASC = 'distance', 'distance ascending'
    DIST_DESC = '-distance', 'distance descending'


# Create your models here.
class Search(models.Model):
    profile = models.ForeignKey(Profile, null=True, on_delete=models.SET_NULL)
    product_query = models.CharField(max_length=100)
    is_starred = models.BooleanField(default=False)
    # is_monitoring = models.BooleanField(default=False)
    created_time = models.DateTimeField(auto_now_add=True)

    # Filters
    price_min = models.DecimalField(
        default=MIN_PRICE, max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES,
        validators=[MinValueValidator(MIN_PRICE), MaxValueValidator(MAX_PRICE)]
    )

    price_max = models.DecimalField(
        default=MAX_PRICE, max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES,
        validators=[MinValueValidator(MIN_PRICE), MaxValueValidator(MAX_PRICE)]
    )

    after_date = models.DateTimeField(validators=[NotFuture], default=(datetime.datetime.now() - datetime.timedelta(days=30)))
    distance = models.PositiveIntegerField(default=MAX_DISTANCE, validators=[MaxValueValidator(MAX_DISTANCE)])
    pnt = models.PointField(srid=SRID, null=True)
    ordering_by = models.CharField(max_length=13, choices=OrderBy.choices, default=OrderBy.TMP_DESC)
    categories = models.ManyToManyField(Category, blank=True)

    def __str__(self):
        return ' '.join(f'{field}: {value}' for field, value in model_to_dict(self).items())

    class Meta:
        ordering = ['-created_time']


class Format(models.TextChoices):
    CSV = 'csv', 'CSV'
    JSON = 'json', 'Json'
    EXCEL = 'xls', 'Excel'


class Dump(models.Model):
    search = models.ForeignKey(Search, on_delete=models.CASCADE)
    analyst = models.ForeignKey(Analyst, null=True, on_delete=models.SET_NULL)
    download_timestamp = models.DateTimeField(auto_now_add=True)
    export_format = models.CharField(max_length=4, choices=Format.choices, default=Format.CSV.value)

    def __str__(self):
        return ' '.join(f'{field}: {value}' for field, value in model_to_dict(self).items())

    class Meta:
        ordering = ['-download_timestamp']


class Report(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    consumer = models.ForeignKey(Consumer, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, null=True, on_delete=models.SET_NULL)
    created_time = models.DateTimeField(auto_now_add=True)
    picture = models.ImageField(upload_to='img/report/%Y', default="img/blank_profile.png")

    price = models.DecimalField(
        max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES,
        validators=[MinValueValidator(MIN_PRICE), MaxValueValidator(MAX_PRICE)]
    )

    pnt = models.PointField(srid=SRID, null=True)

    def __str__(self):
        return f"{self.pk}: {self.product.name} {self.consumer.profile.user.email} {self.price}"

    class Meta:
        ordering = ['-created_time']
