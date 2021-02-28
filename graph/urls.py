from django.urls import path
from graph import views

urlpatterns = [
    path('graph/report/user/most_active', views.GetMostActiveConsumers.as_view()),
    path('graph/report/product/top', views.GetMostRatedProducts.as_view()),
    path('graph/report/product/top/price/avg', views.GetAvgMostRatedProductPrices.as_view()),
    path('graph/report/product/top/price/trend', views.GetMostRatedProductPriceTrend.as_view()),
    path('graph/report/category/top', views.GetMostRatedCategories.as_view()),
    path('graph/report/store/top', views.GetMostRatedStores.as_view()),
    path('graph/search/product/top', views.GetMostSearchedProducts.as_view()),
    path('graph/search/category/top', views.GetMostSearchedCategories.as_view()),
]
