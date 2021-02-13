from rest_framework import serializers
from .models import Product, Store, Category
from rest_framework_gis import serializers as geo_serializers


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['pk', 'name', 'created_by', 'created_time']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['pk', 'picture', 'name', 'categories']


class StoreSerializer(geo_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = Store
        geo_field = 'pnt'
        fields = ['pk', 'picture', 'name', 'pnt']
