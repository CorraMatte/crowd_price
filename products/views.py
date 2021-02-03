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
        try:
            Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': f'category {pk} does not exist'}, status.HTTP_404_NOT_FOUND)

        return Response(
            serial.ProductSerializer(Product.objects.filter(categories=pk), many=True).data,
            status=status.HTTP_200_OK
        )


class RetrieveStoreProductView(APIView):
    def get(self, request, pk):
        try:
            Store.objects.get(pk=pk)
        except Store.DoesNotExist:
            return Response({'error': f'store {pk} does not exist'}, status.HTTP_404_NOT_FOUND)

        return Response(
            serial.ProductSerializer(Product.objects.filter(store=pk), many=True).data,
            status=status.HTTP_200_OK
        )
