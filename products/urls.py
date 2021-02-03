from django.urls import path
from products import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('product/<int:pk>', views.RetrieveProductView.as_view()),
    path('store/<int:pk>', views.RetrieveStoreView.as_view()),
    path('store/<int:pk>/products', views.RetrieveStoreProductView.as_view()),
    path('category/<int:pk>/products', views.RetrieveCategoryProductView.as_view()),
    path('store', views.RetrieveStoreView.as_view()),
]
