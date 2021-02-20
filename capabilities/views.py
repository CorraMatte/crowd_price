from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from capabilities.utils import *
from rest_framework.views import APIView
from capabilities.models import Report, OrderBy, Format
from profiles.models import Consumer, Analyst
from capabilities import serializers as serial
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from profiles.models import Profile
from django.contrib.gis.db.models.functions import Distance
import datetime


class RetrieveReportByNewSearchAPI(APIView):
    def post(self, request):
        serial_search = serial.SearchSerializer(data=request.data)
        if not serial_search.is_valid():
            return Response(serial_search.errors, status.HTTP_400_BAD_REQUEST)

        if self.request.user.pk:
            serial_search.validated_data['profile'] = Profile.objects.get(user=self.request.user.pk)

        search = serial_search.save()
        return Response(get_serial_reports_by_search(search.pk), status.HTTP_200_OK)


class RetrieveReportBySearchAPI(APIView):
    def get(self, request, pk):
        generics.get_object_or_404(Search.objects.all(), pk=pk)
        return Response(get_serial_reports_by_search(pk), status.HTTP_200_OK)


class RetrieveReportByUserAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(consumer__profile__user=self.request.user.pk)


class RetrieveReportByIDAPI(generics.RetrieveAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer


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


class RetrieveNearestReportAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        pnt = Profile.objects.get(user__pk=self.request.user.pk).pnt
        return Report.objects.all().annotate(distance=Distance("pnt", pnt)).order_by("distance")[:10]


class RetrieveNewerReportAPI(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer

    def get_queryset(self):
        return Report.objects.all().order_by('-created_time')[:10]


class CreateReportAPI(APIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        store = None
        try:
            consumer = Consumer.objects.get(profile__user=request.user)
            product = Product.objects.get(pk=request.data['product'])
            if 'store' in request.data:
                store = Store.objects.get(pk=request.data['store'])

        except ObjectDoesNotExist:
            return Response({'detail': 'user not allowed'}, status.HTTP_403_FORBIDDEN)

        serializer = serial.ReportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'detail': serializer.errors}, status.HTTP_400_BAD_REQUEST)

        if 'pnt' not in request.data and 'store' not in request.data:
            return Response({'detail': 'point or store must be provided'}, status.HTTP_400_BAD_REQUEST)

        consumer.experience += 1
        consumer.save()

        serializer.validated_data['consumer'] = consumer
        serializer.validated_data['product'] = product
        if store:
            serializer.validated_data['store'] = store

        report = serializer.save()
        if not report.pnt:
            report.pnt = report.store.pnt
            report.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RetrieveLatestSearchAPI(generics.ListAPIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Search.objects.filter(profile__user=self.request.user.pk).order_by('-created_time')[:3]


class RetrieveStarredSearchAPI(generics.ListAPIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Search.objects.filter(profile__user=self.request.user.pk, is_starred=True).order_by('-created_time')[:3]


class DownloadDumpAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Check if the user is an analyst
    def post(self, request):
        analyst = Analyst.objects.filter(profile__user=request.user)
        if not analyst:
            Response({'detail': 'user not allowed'}, status.HTTP_403_FORBIDDEN)

        serial_dump = serial.DumpSerializer(data=request.data)
        if not serial_dump.is_valid():
            return Response(serial_dump.errors, status.HTTP_400_BAD_REQUEST)

        dump = serial_dump.save()
        filename = f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.{dump.export_format}"

        if dump.export_format == 'csv':
            return get_dump_csv(dump.search.pk, filename)

        elif dump.export_format == 'json':
            return get_dump_json(dump.search.pk, filename)

        elif dump.export_format == 'xls':
            return get_dump_excel(dump.search.pk, filename)

        else:
            return Response({'detail': 'export type not supported'}, status.HTTP_400_BAD_REQUEST)


class AddSearchToFavoriteAPI(APIView):
    queryset = Search.objects.all()
    serializer_class = serial.SearchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = User.objects.get(pk=request.user.id)
        s = Search.objects.filter(user=user).latest('created_time')
        s.is_starred = True
        s.save()
        return Response({'detail': 'success'}, status.HTTP_201_CREATED)


class GetSortingOptions(APIView):
    def get(self, request):
        return Response({'results': OrderBy.choices}, status.HTTP_200_OK)


class GetDumpFormatOptions(APIView):
    def get(self, request):
        return Response({'results': Format.labels}, status.HTTP_200_OK)
