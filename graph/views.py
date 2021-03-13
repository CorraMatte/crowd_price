from datetime import datetime
from django.db.models import Count, Avg
from capabilities.models import Search, Report
from products.models import Product, Store, Category
from profiles.models import Consumer, Profile
from rest_framework import status, permissions, generics
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
            serial_res.append({"name": r.profile.user.email, "value": r.count})

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
        res = Search.objects.filter(
            profile__in=Profile.objects.filter(consumer__isnull=False)).values('product_query').annotate(
            count=Count('product_query')).order_by('-count', 'product_query')[:10]
        serial_res = []

        for r in res:
            serial_res.append({"name": r['product_query'], "value": r['count']})

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetMostSearchedCategories(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Search.objects.filter(
            profile__in=Profile.objects.filter(consumer__isnull=False)).values('categories').annotate(
            count=Count('categories')).order_by('-count', 'categories')[:10]

        serial_res = []
        for r in res:
            serial_res.append({"name": r['categories'], "value": r['count']})

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetAvgMostRatedProductPrices(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @check_user_is_analyst
    def get(self, request):
        res = Product.objects.annotate(count=Count('report')).order_by('-count')[:10].annotate(avg=Avg('report__price'))
        serial_res = []

        for r in res:
            serial_res.append({"name": r.name, "value": r.avg})

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetProductPriceTrend(APIView):
    def get(self, request, pk):
        prod = generics.get_object_or_404(Product.objects.all(), pk=pk)
        reports = Report.objects.filter(product=prod).order_by('created_time')
        serial_res = []

        for r in reports:
            serial_res.append({
                'date': datetime.strftime(r.created_time, '%H:%M:%S %d/%m/%Y'),
                'price': r.price
            })

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetCategoryPriceTrend(APIView):
    def get(self, request, pk):
        cat = generics.get_object_or_404(Category.objects.all(), pk=pk)
        reports = Report.objects.filter(product__categories__in=[cat]).order_by('created_time')
        serial_res = []

        for r in reports:
            serial_res.append({
                'date': datetime.strftime(r.created_time, '%H:%M:%S %d/%m/%Y'),
                r.product.name: r.price
            })

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetStorePriceTrend(APIView):
    def get(self, request, pk):
        store = generics.get_object_or_404(Store.objects.all(), pk=pk)
        reports = Report.objects.filter(store=store).order_by('created_time')
        serial_res = []

        for r in reports:
            serial_res.append({
                'date': datetime.strftime(r.created_time, '%H:%M:%S %d/%m/%Y'),
                r.product.name: r.price
            })

        return Response({'results': serial_res}, status.HTTP_200_OK)


class GetLastReportProduct(APIView):
    def get(self, request, pk):
        prod = generics.get_object_or_404(Product.objects.all(), pk=pk)
        reports = Report.objects.filter(product=prod)[:5]
        serial_res = []

        for r in reports:
            serial_res.append({
                'name': datetime.strftime(r.created_time, '%H:%M:%S %d/%m/%Y'),
                'value': r.price
            })

        return Response({'results': serial_res}, status.HTTP_200_OK)
