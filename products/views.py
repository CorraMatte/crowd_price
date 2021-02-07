from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product, Store, Category
import products.serializers as serial
from rest_framework import status, generics
from django.db.models import Count


class RetrieveProductView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer


class RetrieveStoreView(generics.RetrieveAPIView):
    queryset = Store.objects.all()
    serializer_class = serial.StoreSerializer


class RetrieveCategoryProductView(APIView):
    def get(self, request, pk):
        generics.get_object_or_404(Category, pk)
        return Response(
            serial.ProductSerializer(Product.objects.filter(categories=pk), many=True).data,
            status=status.HTTP_200_OK
        )


# Would be cool to return also the count of the report for each prods
class RetrieveMostReportedProduct(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer

    def get_object(self):
        return Product.objects.annotate(count=Count('report')).order_by('-count')[:10]


class RetrieveStoreProductView(APIView):
    def get(self, request, pk):
        generics.get_object_or_404(Store, pk)
        return Response(
            serial.ProductSerializer(Product.objects.filter(store=pk), many=True).data,
            status=status.HTTP_200_OK
        )


class AddProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer
