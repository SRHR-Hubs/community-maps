from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

class BlogPostSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = models.BlogPost
        fields = '__all__'