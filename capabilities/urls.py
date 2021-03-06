from django.urls import path
from capabilities import views


urlpatterns = [
    # Get
    path('report/<int:pk>', views.RetrieveReportByIDAPI.as_view()),
    path('reports/user', views.RetrieveReportByUserAPI.as_view()),
    path('reports/product/<int:pk>', views.RetrieveReportByProductAPI.as_view()),
    path('reports/store/<int:pk>', views.RetrieveReportByStoreAPI.as_view()),
    path('reports/search/<int:pk>/<int:page>', views.RetrieveReportBySearchWithPaginationAPI.as_view()),
    path('reports/newer', views.RetrieveNewerReportAPI.as_view()),
    path('search/latest', views.RetrieveLatestSearchAPI.as_view()),
    path('search/starred', views.RetrieveStarredSearchAPI.as_view()),
    path('search/<int:pk>', views.RetrieveSearchAPI.as_view()),
    path('search/sort/options', views.GetSortingOptions.as_view()),
    path('dump/format/options', views.GetDumpFormatOptions.as_view()),
    path('search/favorite/all', views.GetFavoriteSearchCurrentUser.as_view()),
    path('dump/last', views.GetLatestDumps.as_view()),

    # Post
    path('reports/search', views.RetrieveReportByNewSearchAPI.as_view()),
    path('report/add', views.CreateReportAPI.as_view()),
    path('reports/dump', views.DownloadLastDumpAPI.as_view()),
    path('search/favorite/add', views.AddSearchToFavoriteAPI.as_view()),
    path('search/favorite/remove', views.RemoveFavoriteSearchCurrentUser.as_view()),
    path('reports/nearest', views.RetrieveNearestReportAPI.as_view()),
]
