from rest_framework.authtoken.models import Token
from rest_framework import generics, status, permissions
from profiles.models import Consumer, Organization, Analyst
from django.contrib.auth.models import User
from profiles import serializers as serial
from rest_framework.views import APIView
from rest_framework.response import Response
from profiles.utils import create_profile


class CreateConsumerAPI(APIView):
    def post(self, request):
        p = create_profile(request)

        if isinstance(p, Response):
            return p

        c = Consumer(profile=p, experience=0)
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
        obj = queryset.get(profile__user=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj


class RetrieveConsumerAPI(generics.RetrieveAPIView):
    queryset = Consumer.objects.all()
    serializer_class = serial.ConsumerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(profile__user=self.request.user.pk)
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
            return Response({'detail': 'invalid email/password'}, status=status.HTTP_400_BAD_REQUEST)

        token = Token.objects.get(user=User.objects.get(email=user.email))

        return Response({
            'key': token.key,
            'type': 'consumer' if Consumer.objects.filter(profile__user=user) else 'analyst'
        })
