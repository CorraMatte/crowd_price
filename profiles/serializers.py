from rest_framework import serializers
from profiles.models import Organization, Profile, Consumer, Analyst
from rest_framework_gis import serializers as geo_serializers


class OrganizationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'picture', 'subscribe_date']


class ConsumerSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 2
        model = Consumer
        fields = ['id', 'profile', 'experience']


class AnalystSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analyst
        fields = ['id', 'profile', 'organization']
