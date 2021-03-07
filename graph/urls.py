from django.urls import path
from graph import views

urlpatterns = [
    path('graph/report/user/most_active', views.GetMostActiveConsumers.as_view()),
    path('graph/report/product/top', views.GetMostRatedProducts.as_view()),
    path('graph/report/product/top/price/avg', views.GetAvgMostRatedProductPrices.as_view()),
    path('graph/report/category/top', views.GetMostRatedCategories.as_view()),
    path('graph/report/store/top', views.GetMostRatedStores.as_view()),
    path('graph/search/product/top', views.GetMostSearchedProducts.as_view()),
    path('graph/search/category/top', views.GetMostSearchedCategories.as_view()),
    path('graph/product/price/trend/<int:pk>', views.GetProductPriceTrend.as_view()),
    path('graph/product/price/last_report/<int:pk>', views.GetLastReportProduct.as_view()),
    path('graph/category/price/trend/<int:pk>', views.GetCategoryPriceTrend.as_view()),
    path('graph/store/price/trend/<int:pk>', views.GetStorePriceTrend.as_view()),
]
