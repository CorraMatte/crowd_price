from rest_framework.views import APIView
from rest_framework.response import Response
from capabilities.models import Report
from products.models import Product, Store, Category
import products.serializers as serial
from rest_framework import status, generics, permissions
from django.db.models import Count, Avg, Max


class RetrieveProductAPI(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer


class RetrieveStoreAPI(generics.RetrieveAPIView):
    queryset = Store.objects.all()
    serializer_class = serial.StoreSerializer


class RetrieveAllStoresAPI(generics.ListAPIView):
    queryset = Store.objects.all()
    serializer_class = serial.StoreSerializer
    pagination_class = None


class RetrieveAllProductsAPI(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer
    pagination_class = None


class RetrieveCategoryProductAPI(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(categories=self.kwargs.get('pk'))


class RetrieveProductPriceAVGAPI(APIView):
    def get(self, request, pk):
        product = generics.get_object_or_404(Product.objects.all(), pk=pk)
        avg = Report.objects.filter(product=product).aggregate(avg=Avg('price'))['avg']
        return Response({"result": avg}, status.HTTP_200_OK)


class RetrieveProductPriceMAXAPI(APIView):
    def get(self, request, pk):
        product = generics.get_object_or_404(Product.objects.all(), pk=pk)
        max = Report.objects.filter(product=product).aggregate(max=Max('price'))['max']
        return Response({"result": max}, status.HTTP_200_OK)


class RetrieveMostReportedProductAPI(APIView):
    def get(self, request):
        prods = Product.objects.annotate(count=Count('report')).order_by('-count')[:9]
        res = []
        for p in prods:
            ps = serial.ProductSerializer(p).data
            ps['count'] = p.count
            res.append(ps)

        return Response(res, status.HTTP_200_OK)


class RetrieveCategoriesAPI(APIView):
    def get(self, request):
        categories = Category.objects.annotate(product_count=Count('product'))
        res = {'results': []}
        for c in categories:
            res['results'].append({'id': c.pk, 'name': c.name, 'product_count': c.product_count})

        return Response(res, status.HTTP_200_OK)


# post: views that create objects
class CreateProductAPI(APIView):
    queryset = Product.objects.all()
    serializer_class = serial.ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serial_prod = serial.ProductSerializer(data=request.data)
        if not serial_prod.is_valid():
            return Response(serial_prod.errors, status.HTTP_400_BAD_REQUEST)

        if 'categories' not in request.data:
            return Response({'detail': 'categories field is missing'}, status.HTTP_400_BAD_REQUEST)

        p = serial_prod.save()
        if isinstance(request.data['categories'], list):
            p.categories.set(request.data['categories'])
        else:
            p.categories.set([request.data['categories']])

        p.save()
        return Response({"result": serial.ProductSerializer(p).data}, status.HTTP_201_CREATED)


class CreateCategoryAPI(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = serial.CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
