from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

class ServiceSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = models.Service
        exclude = ('_contact',)