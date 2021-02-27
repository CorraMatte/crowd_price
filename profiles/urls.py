from django.urls import path, include
from profiles import views


urlpatterns = [
    # Custom
    path('consumer/signup', views.CreateConsumerAPI.as_view()),
    path('analyst/signup', views.CreateAnalystAPI.as_view()),
    path('consumer/detail', views.RetrieveConsumerAPI.as_view()),
    path('analyst/detail', views.RetrieveAnalystAPI.as_view()),
    path('organization/<int:pk>', views.RetrieveOrganizationAPI.as_view()),

    # Auth
    path('user/login', views.LoginAPI.as_view()),
]
