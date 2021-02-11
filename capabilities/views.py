from capabilities.utils import *
from rest_framework.views import APIView
from capabilities.models import Report
from capabilities import serializers as serial
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from profiles.models import Profile
from django.contrib.gis.db.models.functions import Distance
import datetime


class RetrieveReportBySearchAPI(APIView):
    def get(self, request):
        serial_search = serial.SearchSerializer(data=request.GET)
        if not serial_search.is_valid():
            return Response(serial_search.errors, status.HTTP_400_BAD_REQUEST)

        search = serial_search.save()
        return Response(get_serial_reports_by_search(search.pk), status.HTTP_200_OK)


class RetrieveReportByUserAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            serial.ReportSerializer(Report.objects.filter(consumer__profile__user=request.user), many=True).data,
            status=status.HTTP_200_OK
        )


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


class CreateReportAPI(generics.CreateAPIView):
    queryset = Report.objects.all()
    serializer_class = serial.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({'detail': serializer.errors}, status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        if 'pnt' not in data and 'store' not in data:
            return Response({'detail': 'point or store must be provided'}, status.HTTP_400_BAD_REQUEST)

        consumer = Consumer.objects.get(profile__user__email=data['consumer'])
        consumer.experience += 1
        consumer.save()

        report = serializer.save()
        if not report.pnt:
            report.pnt = report.store.pnt
            report.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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
    def get(self, request):
        serial_dump = serial.DumpSerializer(data=request.GET)
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
