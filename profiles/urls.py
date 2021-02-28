from django.urls import path
from profiles import views


urlpatterns = [
    # Post
    path('consumer/signup', views.CreateConsumerAPI.as_view()),
    path('analyst/signup', views.CreateAnalystAPI.as_view()),
    path('user/login', views.LoginAPI.as_view()),

    # Get
    path('consumer/detail', views.RetrieveConsumerAPI.as_view()),
    path('analyst/detail', views.RetrieveAnalystAPI.as_view()),
    path('organization/<int:pk>', views.RetrieveOrganizationAPI.as_view()),
]
