from rest_framework import serializers
from .models import Product, Store, Category
from rest_framework_gis import serializers as geo_serializers


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_time']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        depth = 1
        fields = ['id', 'name', 'categories']


class StoreSerializer(geo_serializers.GeoFeatureModelSerializer):
    class Meta:
        model = Store
        geo_field = 'pnt'
        fields = ['id', 'picture', 'name', 'pnt']
