from rest_framework import serializers
from .models import Product, Store, Category


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['pk', 'name', 'created_by', 'created_time']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['pk', 'picture', 'name', 'categories']


class StoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Store
        fields = ['pk', 'picture', 'name', 'location']
