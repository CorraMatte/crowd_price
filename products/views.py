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
        generics.get_object_or_404(Category.objects.all(), pk=pk)
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


class RetrieveCategoriesView(APIView):
    def get(self, request):
        categories = Category.objects.annotate(product_count=Count('product'))
        res = []
        for c in categories:
            r = {'pk': c.pk, 'name': c.name, 'product_count': c.product_count}
            res.append(r)

        return Response({'detail': res}, status.HTTP_200_OK)


# post: views that create objects
class CreateProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer


class CreateCategoryView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = serial.CategorySerializer
