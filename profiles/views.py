from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.core.exceptions import ValidationError
from rest_framework import generics, status
from profiles.models import Consumer, Organization, Profile, Analyst
from django.contrib.auth.models import User
from profiles import serializers as serial
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.password_validation import validate_password


class AddConsumerView(APIView):
    def post(self, request):
        # User validation
        data = request.data
        email = data.get('email')
        password1, password2 = data.get('password1'), data.get('password2'),
        if not email:
            return Response({"detail": "email field is empty"}, status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email):
            return Response({"detail": "email is already presents in the database"}, status.HTTP_400_BAD_REQUEST)

        if password1 != password2 or password1 is None:
            return Response({"detail": "password not valid or doesn't match"}, status.HTTP_400_BAD_REQUEST)

        user = User(username=email, email=email, password=password1)
        try:
            validate_password(password1, user)
        except ValidationError as e:
            return Response({"detail": e}, status.HTTP_400_BAD_REQUEST)

        user.save()
        # Check for location during the registration
        profile = Profile(user=user, )
        profile.save()

        consumer = Consumer(profile=profile)
        consumer.save()

        return Response({"detail": "consumer created"}, status.HTTP_200_OK)


class RetrieveAnalystView(generics.RetrieveAPIView):
    queryset = Analyst.objects.all()
    serializer_class = serial.AnalystSerializer


class RetrieveConsumerView(generics.RetrieveAPIView):
    queryset = Consumer.objects.all()
    serializer_class = serial.ConsumerSerializer


class RetrieveOrganizationView(generics.RetrieveAPIView):
    queryset = Organization.objects.all()
    serializer_class = serial.ConsumerSerializer


# Create your views here.
class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
