from django.urls import path, include
from profiles import views


urlpatterns = [
    # Custom
    path('consumer/add', views.CreateConsumerView.as_view()),
    path('consumer/<int:pk>', views.RetrieveConsumerView.as_view()),
    path('analyst/<int:pk>', views.RetrieveAnalystView.as_view()),
    path('organization/<int:pk>', views.RetrieveOrganizationView.as_view()),

    # Auth
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('rest-auth/facebook/', views.FacebookLogin.as_view(), name="facebook_login"),
    path('rest-auth/google/', views.GoogleLogin.as_view(), name="google_login"),
]
