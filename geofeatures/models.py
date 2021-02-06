from django.contrib.gis.db import models as geo_model


# Create your geo_model here.
# https://docs.djangoproject.com/en/3.1/ref/contrib/gis/tutorial/
# sudo apt install libgdal-dev

class Country(geo_model.Model):
    fips = geo_model.CharField(max_length=2, null=True)
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


# no usage of geography type
# https://postgis.net/docs/using_postgis_dbmanagement.html#PostGIS_GeographyVSGeometry
# Small area and not continetal, wwget https://thematicmapping.org/downloads/TM_WORLD_BORDERS-0.3.zipould be a waste of CPU
class Location(geo_model.Model):
    # Regular Django fields corresponding to the attributes in the world borders shapefile.
    country = geo_model.ForeignKey(Country, on_delete=geo_model.CASCADE)
    address = geo_model.CharField(max_length=50)
    pnt = geo_model.PointField(srid=4326)

    def __str__(self):
        return f"{self.pnt.x} {self.pnt.y}"
