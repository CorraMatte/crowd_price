from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from capabilities.utils import *
from rest_framework.views import APIView
from capabilities.models import Report, OrderBy, Format, Dump
from products.models import Store
from profiles.models import Consumer, Analyst
from capabilities import serializers as serial
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from profiles.models import Profile
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import GEOSGeometry
from crowd_price.const import SRID
from django.contrib.gis.geos.error import GEOSException
import datetime


class RetrieveReportByNewSearchAPI(APIView):
    def post(self, request):
        serial_search = serial.SearchSerializer(data=request.data)
        if not serial_search.is_valid():
            return Response(serial_search.errors, status.HTTP_400_BAD_REQUEST)

        if self.request.user.pk:
            serial_search.validated_data['profile'] = Profile.objects.get(user=self.request.user.pk)

        search = serial_search.save()
        res = get_serial_reports_by_search(search.pk)
        return Response({
            'count': len(res['features']),
            'id': search.pk,
            'results': res
        }, status.HTTP_200_OK)


class RetrieveReportBySearchWithPaginationAPI(APIView):
    def get(self, request, pk, page):
        generics.get_object_or_404(Search.objects.all(), pk=pk)
        res = get_serial_reports_by_search(pk)

        try:
            slice_results = res['features'][page * 9:(page * 10) + 10 - 1]
        except IndexError:
            return Response({'detail': 'Value of the page is not correct'}, status.HTTP_400_BAD_REQUEST)

        return Response({
            'count': len(res['features']),
            'results': {
                'features': slice_results
            }
        }, status.HTTP_200_OK)


class RetrieveReportByUserAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(consumer__profile__user=self.request.user.pk)


class RetrieveReportByIDAPI(generics.RetrieveAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer


class RetrieveSearchAPI(generics.RetrieveAPIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer


class RetrieveReportByStoreAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer

    def get_queryset(self):
        store = generics.get_object_or_404(Store.objects.all(), pk=self.kwargs.get('pk'))
        return Report.objects.filter(store=store)


class RetrieveReportByProductAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer

    def get_queryset(self):
        product = generics.get_object_or_404(Product.objects.all(), pk=self.kwargs.get('pk'))
        return Report.objects.filter(product=product)


class RetrieveNearestReportAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            pnt = GEOSGeometry(request.data['pnt'], srid=SRID)
        except (GEOSException, ValueError) as e:
            return Response({"detail": f"position not in a valid format: {e}"}, status.HTTP_400_BAD_REQUEST)

        return Response({
            "results": serial.ReportSerializer(
                Report.objects.all().annotate(distance=Distance("pnt", pnt)).order_by("distance")[:9], many=True
            ).data
        }, status.HTTP_200_OK)


class RetrieveNewerReportAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer

    def get_queryset(self):
        return Report.objects.all().order_by('-created_time')[:9]


class CreateReportAPI(APIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            consumer = Consumer.objects.get(profile__user=request.user)
        except ObjectDoesNotExist:
            return Response({'detail': 'user not allowed'}, status.HTTP_403_FORBIDDEN)

        serializer = serial.ReportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'detail': serializer.errors}, status.HTTP_400_BAD_REQUEST)

        product = Product.objects.get(pk=request.data['product'])
        store = Store.objects.get(pk=request.data['store']) if 'store' in request.data else None
        if 'pnt' not in request.data and 'store' not in request.data:
            return Response({'detail': 'point or store must be provided'}, status.HTTP_400_BAD_REQUEST)

        consumer.save()

        serializer.validated_data['consumer'] = consumer
        serializer.validated_data['product'] = product
        if store:
            serializer.validated_data['store'] = store

        report = serializer.save()
        if store:
            report.pnt = report.store.pnt
            report.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RetrieveLatestSearchAPI(generics.ListAPIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return [Search.objects.filter(profile__user=self.request.user.pk).order_by('-created_time')[0]]
        except IndexError:
            return []


class GetLatestDumps(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            serial.DumpSerializer(
                Dump.objects.filter(search__profile__user=request.user.pk).order_by('-download_timestamp')[:10],
                many=True
            ).data,
            status.HTTP_200_OK
        )


class RetrieveStarredSearchAPI(generics.ListAPIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Search.objects.filter(profile__user=self.request.user.pk, is_starred=True).order_by('-created_time')[:3]


class DownloadLastDumpAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Check if the current user is an analyst
        try:
            Analyst.objects.get(profile__user=request.user.pk)
        except ObjectDoesNotExist:
            return Response({'detail': 'user not allowed'}, status.HTTP_403_FORBIDDEN)

        serial_dump = serial.DumpSerializer(data=request.data)
        if not serial_dump.is_valid():
            return Response(serial_dump.errors, status.HTTP_400_BAD_REQUEST)

        dump = serial_dump.save()

        if dump.export_format == 'csv':
            return get_dump_csv(dump.search.pk, f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")

        elif dump.export_format == 'json':
            return get_dump_json(dump.search.pk, f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json")

        elif dump.export_format == 'xls':
            return get_dump_excel(dump.search.pk, f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}")

        else:
            return Response({'detail': 'export type not supported'}, status.HTTP_400_BAD_REQUEST)


class AddSearchToFavoriteAPI(APIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = User.objects.get(pk=request.user.id)
        s = Search.objects.filter(profile=Profile.objects.get(user=user)).latest('created_time')
        s.is_starred = True
        s.save()
        return Response({'detail': 'success'}, status.HTTP_201_CREATED)


class GetFavoriteSearchCurrentUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = User.objects.get(pk=request.user.id)
        searches = Search.objects.filter(profile=Profile.objects.get(user=user), is_starred=True)
        res = []
        for s in searches:
            res.append({
                'id': s.id,
                'product': s.product_query,
                'total_results': len(get_serial_reports_by_search(s.id)['features'])
            })

        return Response({'results': res}, status.HTTP_200_OK)


class RemoveFavoriteSearchCurrentUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = User.objects.get(pk=request.user.id)
        try:
            _id = request.data['id']
            search = Search.objects.get(pk=_id, profile=Profile.objects.get(user=user), is_starred=True)
            if not search:
                raise ObjectDoesNotExist

            search.is_starred = False
            search.save()
        except (ObjectDoesNotExist, KeyError):
            return Response({
                'details': 'Insert the ID of the search to remove or ID not found or not valid.'
            }, status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Search correctly removed'}, status.HTTP_201_CREATED)


class GetSortingOptions(APIView):
    def get(self, request):
        return Response({'results': OrderBy.choices}, status.HTTP_200_OK)


class GetDumpFormatOptions(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({'results': Format.choices}, status.HTTP_200_OK)
