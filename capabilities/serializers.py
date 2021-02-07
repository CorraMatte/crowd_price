from rest_framework import serializers
from capabilities.models import Search, Dump, Report
from rest_framework_gis import serializers as geo_serializers


class SearchSerializer(geo_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = Search
        geo_field = 'pnt'
        fields = [
            'profile', 'product_query', 'is_starred', 'price_min', 'price_max', 'after_date',
            'distance', 'pnt', 'ordering_by'
        ]


class DumpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dump
        fields = ['search', 'analyst', 'download_timestamp', 'export_format']


class ReportSerializer(geo_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = Report
        geo_field = 'pnt'
        fields = ['pk', 'product', 'consumer', 'store', 'created_time', 'price', 'pnt']
