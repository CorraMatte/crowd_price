from rest_framework import serializers
from profiles.models import Organization, Profile, Consumer, Analyst


class OrganizationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Organization
        fields = ['name']


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'picture', 'subscribe_date', 'location']


class ConsumerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Consumer
        fields = ['profile', 'experience', 'birth']


class AnalystSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Analyst
        fields = ['profile', 'organization']
