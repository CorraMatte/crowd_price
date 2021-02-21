from django.db.models import Count, Avg
from capabilities.models import Search
from products.models import Product, Store, Category
from profiles.models import Consumer
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from graph.utils import check_user_is_analyst, get_serial_response_by_name


class GetMostActiveConsumers(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Consumer.objects.annotate(count=Count('report')).order_by('-count')[:10]
        serial_res = []

        for r in res:
            serial_res.append([r.profile.user.email, r.count])

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetMostRatedProducts(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Product.objects.annotate(count=Count('report')).order_by('-count')[:10]
        return get_serial_response_by_name(res)


class GetMostRatedCategories(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Category.objects.annotate(count=Count('product__report')).order_by('-count')[:10]
        return get_serial_response_by_name(res)


class GetMostRatedStores(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Store.objects.annotate(count=Count('report')).order_by('-count')[:10]
        return get_serial_response_by_name(res)


class GetMostSearchedProducts(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Search.objects.values('product_query').annotate(count=Count('product_query')).order_by('-count', 'product_query')[:10]
        serial_res = []

        for r in res:
            serial_res.append([r['product_query'], r['count']])

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetMostSearchedCategories(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Category.objects.annotate(count=Count('search')).order_by('-count')[:10]
        return get_serial_response_by_name(res)


class GetAvgMostRatedProductPrices(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Product.objects.annotate(count=Count('report')).order_by('-count')[:10].annotate(avg=Avg('report__price'))
        serial_res = []

        for r in res:
            serial_res.append([r.name, r.avg])

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetMostRatedProductPriceTrend(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        prods = Product.objects.annotate(count=Count('report')).order_by('-count')[:10]
        serial_res = []

        for p in prods:
            serial_res.append([p.name, [r.price for r in p.report_set.all()[:20]]])

        return Response({'results': serial_res}, status.HTTP_200_OK)
