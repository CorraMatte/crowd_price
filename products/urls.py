from django.urls import path
from products import views


urlpatterns = [
    # Get
    path('product/<int:pk>', views.RetrieveProductView.as_view()),
    path('store/<int:pk>', views.RetrieveStoreView.as_view()),
    path('category/<int:pk>/products', views.RetrieveCategoryProductView.as_view()),
    path('categories/', views.RetrieveCategoriesView.as_view()),
    path('store', views.RetrieveStoreView.as_view()),
    path('products/most_reported', views.RetrieveMostReportedProduct.as_view()),

    # Post
    path('product/add', views.CreateProductView.as_view()),
    path('category/add', views.CreateCategoryView.as_view()),
]
