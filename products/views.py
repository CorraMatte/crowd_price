from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product, Store, Category
import products.serializers as serial
from rest_framework import status
from rest_framework import generics


class RetrieveProductView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer


class RetrieveStoreView(generics.RetrieveAPIView):
    queryset = Store.objects.all()
    serializer_class = serial.StoreSerializer


class RetrieveCategoryProductView(APIView):
    def get(self, request, pk):
        get_object_or_404(Category, pk)
        return Response(
            serial.ProductSerializer(Product.objects.filter(categories=pk), many=True).data,
            status=status.HTTP_200_OK
        )


class RetrieveStoreProductView(APIView):
    def get(self, request, pk):
        get_object_or_404(Store, pk)
        return Response(
            serial.ProductSerializer(Product.objects.filter(store=pk), many=True).data,
            status=status.HTTP_200_OK
        )


class AddProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer
