from rest_framework.views import APIView
from rest_framework.response import Response
from products.models import Product, Store, Category
import products.serializers as serial
from rest_framework import status, generics
from django.db.models import Count


class RetrieveProductAPI(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer


class RetrieveStoreAPI(generics.RetrieveAPIView):
    queryset = Store.objects.all()
    serializer_class = serial.StoreSerializer


class RetrieveAllStoresAPI(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = serial.StoreSerializer


class RetrieveCategoryProductAPI(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(categories=self.kwargs.get('pk'))


# Would be cool to return also the count of the report for each prods
class RetrieveMostReportedProductAPI(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer

    def get_queryset(self):
        return Product.objects.annotate(count=Count('report')).order_by('-count')[:10]


class RetrieveCategoriesAPI(APIView):
    def get(self, request):
        categories = Category.objects.annotate(product_count=Count('product'))
        res = []
        for c in categories:
            r = {'pk': c.pk, 'name': c.name, 'product_count': c.product_count}
            res.append(r)

        return Response(res, status.HTTP_200_OK)


# post: views that create objects
class CreateProductAPI(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer


class CreateCategoryAPI(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = serial.CategorySerializer
