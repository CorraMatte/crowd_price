from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import WorldBorder


world_mapping = {
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

world_shp = Path(__file__).resolve().parent / 'data' / 'Europe_coastline_poly.shp'
# Path('/home/corra/Dropbox/Unimore/Magistrale/Secondo\ Anno/Primo\ Semestre/Applicazone\ distribuite\ e\ mobili/crowd_price/Europe_coastline_poly.shp')
#


def run(verbose=True):
    lm = LayerMapping(WorldBorder, str(world_shp), world_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)
