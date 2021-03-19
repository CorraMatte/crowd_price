from rest_framework import serializers
from capabilities.models import Search, Dump, Report
from rest_framework_gis import serializers as geo_serializers


class SearchSerializer(geo_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = Search
        geo_field = 'pnt'
        fields = [
            'id', 'profile', 'product_query', 'is_starred', 'price_min', 'price_max', 'after_date',
            'distance', 'pnt', 'ordering_by', 'categories'
        ]


class DumpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dump
        fields = ['id', 'download_timestamp', 'export_format', 'search']


class ReportSerializer(geo_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = Report
        geo_field = 'pnt'
        depth = 3
        fields = ['id', 'product', 'consumer', 'store', 'created_time', 'price', 'pnt', 'picture']
