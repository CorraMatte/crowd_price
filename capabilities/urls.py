from django.urls import path, include
from capabilities import views


urlpatterns = [
    path('reports/search', views.RetrieveReportBySearchAPI.as_view()),
    path('reports/dump', views.DownloadDumpAPI.as_view()),
    path('reports/newer', views.RetrieveNewerReport.as_view()),
    path('reports/nearest', views.RetrieveNearestReport.as_view()),
    path('report/add', views.CreateReportAPI.as_view())
]
