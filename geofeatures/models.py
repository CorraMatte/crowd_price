from django.contrib.gis.db import models


# Create your models here.
# https://docs.djangoproject.com/en/3.1/ref/contrib/gis/tutorial/
# sudo apt install libgdal-dev

class Location(models.Model):
    # Regular Django fields corresponding to the attributes in the world borders shapefile.
    # name = models.CharField(max_length=50)
    area = models.IntegerField()
    pop2005 = models.IntegerField('Population 2005')
    fips = models.CharField('FIPS Code', max_length=2, null=True)
    iso2 = models.CharField('2 Digit ISO', max_length=2)
    iso3 = models.CharField('3 Digit ISO', max_length=3)
    un = models.IntegerField('United Nations Code')
    region = models.IntegerField('Region Code')
    subregion = models.IntegerField('Sub-Region Code')
    lon = models.FloatField()
    lat = models.FloatField()

    # GeoDjango-specific: a geometry field (MultiPolygonField)
    mpoly = models.MultiPolygonField()

    # city = models.CharField(max_length=100, default=False)
    # country = models.CharField(max_length=100, default=False)
    # address = models.CharField(max_length=100, default=False)
    # last_access = models.MultiPolygonField()
