from django.contrib.gis.db import models as geo_model
from django.db import models


# Create your geo_model here.
# https://docs.djangoproject.com/en/3.1/ref/contrib/gis/tutorial/
# sudo apt install libgdal-dev

class WorldBorder(geo_model.Model):
    fips = geo_model.CharField(max_length=2)
    iso2 = geo_model.CharField(max_length=2)
    iso3 = geo_model.CharField(max_length=3)
    un = geo_model.IntegerField()
    name = geo_model.CharField(max_length=50)
    area = geo_model.IntegerField()
    pop2005 = geo_model.BigIntegerField()
    region = geo_model.IntegerField()
    subregion = geo_model.IntegerField()
    lon = geo_model.FloatField()
    lat = geo_model.FloatField()
    mpoly = geo_model.MultiPolygonField()


# Auto-generated `LayerMapping` dictionary for WorldBorder model
worldborder_mapping = {
    'fips': 'FIPS',
    'iso2': 'ISO2',
    'iso3': 'ISO3',
    'un': 'UN',
    'name': 'NAME',
    'area': 'AREA',
    'pop2005': 'POP2005',
    'region': 'REGION',
    'subregion': 'SUBREGION',
    'lon': 'LON',
    'lat': 'LAT',
    'mpoly': 'MULTIPOLYGON',
}



class Location(models.Model):
    # Regular Django fields corresponding to the attributes in the world borders shapefile.
    # world_reference = geo_model.ForeignKey(WorldBorder, on_delete=geo_model.CASCADE)


    name = geo_model.CharField(max_length=50)
    # area = geo_model.IntegerField()
    # pop2005 = geo_model.IntegerField('Population 2005')
    # fips = geo_model.CharField('FIPS Code', max_length=2, null=True)
    # iso2 = geo_model.CharField('2 Digit ISO', max_length=2)
    # iso3 = geo_model.CharField('3 Digit ISO', max_length=3)
    # un = geo_model.IntegerField('United Nations Code')
    # region = geo_model.IntegerField('Region Code')
    # subregion = geo_model.IntegerField('Sub-Region Code')
    # lon = geo_model.FloatField()
    # lat = geo_model.FloatField()
    #
    # # GeoDjango-specific: a geometry field (MultiPolygonField)
    # mpoly = geo_model.MultiPolygonField()

    # city = geo_model.CharField(max_length=100, default=False)
    # country = geo_model.CharField(max_length=100, default=False)
    # address = geo_model.CharField(max_length=100, default=False)
    # last_access = geo_model.MultiPolygonField()
