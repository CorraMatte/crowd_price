from django.urls import path
from products import views


urlpatterns = [
    # Get
    path('product/<int:pk>', views.RetrieveProductAPI.as_view()),
    path('store/<int:pk>', views.RetrieveStoreAPI.as_view()),
    path('stores', views.RetrieveAllStoresAPI.as_view()),
    path('products/category/<int:pk>', views.RetrieveCategoryProductAPI.as_view()),
    path('categories/', views.RetrieveCategoriesAPI.as_view()),
    path('products/most_reported', views.RetrieveMostReportedProductAPI.as_view()),

    # Post
    path('product/add', views.CreateProductAPI.as_view()),
    path('category/add', views.CreateCategoryAPI.as_view()),
]
