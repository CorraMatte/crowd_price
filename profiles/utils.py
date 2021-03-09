from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from rest_framework import status
from profiles import serializers as serial
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from profiles.models import Consumer, Analyst


# User validation
def create_profile(request):
    data = request.data
    email = data.get('email')
    password1, password2 = data.get('password1'), data.get('password2')
    if not email:
        return Response({"detail": ["email field is empty"]}, status.HTTP_400_BAD_REQUEST)

    if password1 != password2 or password1 is None:
        return Response({"detail": ["password not valid or doesn't match"]}, status.HTTP_400_BAD_REQUEST)

    user = User(username=email, email=email, password=password1)

    try:
        user.set_password(password1)
        user.save()
    except IntegrityError:
        return Response({"detail": ["The email is already present in the database"]}, status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(password1, user)
    except ValidationError as e:
        user.delete()
        return Response({"detail": e}, status.HTTP_400_BAD_REQUEST)

    # Create user Token
    Token.objects.create(user=user)

    # Check for location during the registration
    profile = serial.ProfileSerializer(data={
        'user': user.pk
    })

    if not profile.is_valid():
        user.delete()
        return Response({"detail": profile.errors}, status.HTTP_400_BAD_REQUEST)

    p = profile.save()
    return p


def get_user_type(user):
    if Consumer.objects.filter(profile__user=user):
        return 'consumer'
    elif Analyst.objects.filter(profile__user=user):
        return 'analyst'
    else:
        return 'anon'
