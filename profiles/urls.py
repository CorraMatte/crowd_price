from django.conf.urls.static import static
from django.urls import path

from crowd_price import settings
from profiles import views


urlpatterns = [
    # Post
    path('consumer/signup', views.CreateConsumerAPI.as_view()),
    path('analyst/signup', views.CreateAnalystAPI.as_view()),
    path('user/login', views.LoginAPI.as_view()),

    # Put
    path('profile/update/img', views.ChangeProfilePicAPI.as_view()),
    path('user/update/password', views.ChangeUserPasswordAPI.as_view()),

    # Get
    path('profile/img', views.RetrieveProfilePicAPI.as_view()),
    path('consumer/detail', views.RetrieveConsumerAPI.as_view()),
    path('consumer/experience', views.RetrieveConsumerExpAPI.as_view()),
    path('analyst/detail', views.RetrieveAnalystAPI.as_view()),
    path('organization/<int:pk>', views.RetrieveOrganizationAPI.as_view()),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
