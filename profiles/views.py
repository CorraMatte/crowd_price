from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_image_file_extension
from django.core.exceptions import ValidationError
from jsonschema._reflect import ObjectNotFound
from rest_framework.authtoken.models import Token
from rest_framework import generics, status, permissions
from profiles.models import Consumer, Organization, Analyst, Profile
from django.contrib.auth.models import User
from profiles import serializers as serial
from rest_framework.views import APIView
from rest_framework.response import Response
from profiles.utils import create_profile, get_user_type


class CreateConsumerAPI(APIView):
    def post(self, request):
        p = create_profile(request)

        if isinstance(p, Response):
            return p

        c = Consumer(profile=p) #, experience=0)
        c.save()
        return Response({"detail": serial.ConsumerSerializer(c).data}, status.HTTP_201_CREATED)


class CreateAnalystAPI(APIView):
    def post(self, request):
        p = create_profile(request)

        if isinstance(p, Response):
            return p

        org = generics.get_object_or_404(Organization.objects.all(), pk=request.data.get('organization'))
        a = Analyst(profile=p, organization=org)
        a.save()
        return Response({"detail": serial.AnalystSerializer(a).data}, status.HTTP_201_CREATED)


class RetrieveAnalystAPI(generics.RetrieveAPIView):
    queryset = Analyst.objects.all()
    serializer_class = serial.AnalystSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        try:
            obj = queryset.get(profile__user=self.request.user.pk)
        except ObjectNotFound:
            obj = {}

        self.check_object_permissions(self.request, obj)
        return obj


class RetrieveConsumerAPI(generics.RetrieveAPIView):
    queryset = Consumer.objects.all()
    serializer_class = serial.ConsumerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        try:
            obj = queryset.get(profile__user=self.request.user.pk)
        except ObjectNotFound:
            obj = {}

        self.check_object_permissions(self.request, obj)
        return obj


class RetrieveOrganizationAPI(generics.RetrieveAPIView):
    queryset = Organization.objects.all()
    serializer_class = serial.ConsumerSerializer
    permission_classes = [permissions.IsAuthenticated]


class LoginAPI(APIView):
    """
    Return user token after login
    """
    def post(self, request):
        # Retrieve user
        user = generics.get_object_or_404(User.objects.all(), email=request.data.get('email'))

        # Check password
        if not user.check_password(request.data.get('password')):
            return Response({'detail': 'Invalid email or password!'}, status=status.HTTP_400_BAD_REQUEST)

        token = Token.objects.get(user=User.objects.get(email=user.email))

        return Response({
            'key': token.key,
            'type': get_user_type(user)
        }, status.HTTP_200_OK)


class ChangeProfilePicAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        if 'image' not in request.data:
            return Response({'detail': 'image is a required parameter'}, status.HTTP_400_BAD_REQUEST)

        try:
            validate_image_file_extension(request.data['image'])
        except ValidationError:
            return Response({'detail': 'Selected file is not a valid image'}, status.HTTP_400_BAD_REQUEST)

        profile = generics.get_object_or_404(Profile.objects.all(), user=request.user)
        profile.picture = request.data['image']
        profile.save()

        return Response({"detail": "image change correctly"}, status.HTTP_201_CREATED)


class RetrieveProfilePicAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = generics.get_object_or_404(Profile.objects.all(), user=request.user)
        return Response({'results': profile.picture.url}, status.HTTP_200_OK)


class RetrieveConsumerExpAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        c = generics.get_object_or_404(Consumer.objects.all(), profile__user=request.user)
        return Response({'result': c.experience}, status.HTTP_200_OK)


class ChangeUserPasswordAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        data = request.data
        u = request.user
        old_password = data.get('old_password')
        if not u.check_password(old_password):
            return Response({'detail': ['Old password is not correct']}, status.HTTP_404_NOT_FOUND)

        password1, password2 = data.get('new_password1'), data.get('new_password2')
        if password1 != password2 or password1 is None:
            return Response({"detail": ["password not valid or doesn't match"]}, status.HTTP_400_BAD_REQUEST)

        if old_password == password1:
            return Response({'detail': ['Insert a different password']}, status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password1, u)
        except ValidationError as e:
            return Response({"detail": e}, status.HTTP_400_BAD_REQUEST)

        u.set_password(password1)
        u.save()
        return Response({"detail": "Password updated successfully"}, status.HTTP_201_CREATED)
