from django.urls import path
from capabilities import views


urlpatterns = [
    # Get
    path('reports/search', views.RetrieveReportByNewSearchAPI.as_view()),
    path('reports/user', views.RetrieveReportByUserAPI.as_view()),
    path('reports/store/<int:pk>', views.RetrieveReportByStoreAPI.as_view()),
    path('reports/search/<int:pk>', views.RetrieveReportBySearchAPI.as_view()),
    path('reports/dump', views.DownloadDumpAPI.as_view()),
    path('reports/newer', views.RetrieveNewerReportAPI.as_view()),
    path('reports/nearest', views.RetrieveNearestReportAPI.as_view()),

    path('search/latest', views.RetrieveLatestSearchAPI.as_view()),
    path('search/starred', views.RetrieveStarredSearchAPI.as_view()),

    # Post
    path('report/add', views.CreateReportAPI.as_view())
]
