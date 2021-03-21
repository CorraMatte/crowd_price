from pytz import timezone
from django.utils import timezone as django_timezone
from django.contrib.gis.db import models
from crowd_price.const import *
from crowd_price.validators import NotFuture
from profiles.models import Profile, Analyst, Consumer
from products.models import Product, Store, Category
from django.core.validators import MaxValueValidator, MinValueValidator
from django.forms.models import model_to_dict
import datetime

italy_timezone = timezone('Europe/Rome')


class OrderBy(models.TextChoices):
    TMP_DESC = '-created_time', 'Order by newer report'
    TMP_ASC = 'created_time', 'Order by newer older'
    PRC_ASC = 'price', 'Order by cheaper'
    PRC_DESC = '-price', 'Order by expensive'
    DIST_ASC = 'distance', 'Order by nearest'
    DIST_DESC = '-distance', 'Order by furthest'


class Search(models.Model):
    profile = models.ForeignKey(Profile, null=True, on_delete=models.SET_NULL)
    product_query = models.CharField(max_length=100)
    is_starred = models.BooleanField(default=False)
    created_time = models.DateTimeField(default=django_timezone.now)

    # Filters
    price_min = models.DecimalField(
        default=MIN_PRICE, max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES,
        validators=[MinValueValidator(MIN_PRICE), MaxValueValidator(MAX_PRICE)]
    )

    price_max = models.DecimalField(
        default=MAX_PRICE, max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES,
        validators=[MinValueValidator(MIN_PRICE), MaxValueValidator(MAX_PRICE)]
    )

    after_date = models.DateTimeField(
        validators=[NotFuture],
        default=italy_timezone.localize(datetime.datetime.now() - datetime.timedelta(days=365))
    )
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
    JSON = 'json', 'JSON'
    EXCEL = 'xls', 'Excel'


class Dump(models.Model):
    search = models.ForeignKey(Search, on_delete=models.CASCADE)
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
    created_time = models.DateTimeField(default=django_timezone.now)
    picture = models.ImageField(upload_to='reports/%Y', default="reports/blank_report.png")

    price = models.DecimalField(
        max_digits=MAX_DIGITS, decimal_places=DECIMAL_PLACES,
        validators=[MinValueValidator(MIN_PRICE), MaxValueValidator(MAX_PRICE)]
    )

    pnt = models.PointField(srid=SRID, null=True)

    def __str__(self):
        return f"{self.pk}: {self.product.name} {self.consumer.profile.user.email} {self.price}"

    class Meta:
        ordering = ['-created_time']
