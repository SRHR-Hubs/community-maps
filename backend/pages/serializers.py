from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

Base = FlexFieldsModelSerializer


class PageBaseSerializer(serializers.Serializer):
    pass

    # any common functionality will go here


class BlogPostSerializer(PageBaseSerializer, Base):
    class Meta:
        model = models.BlogPost
        fields = '__all__'


class PageSerializer(PageBaseSerializer, Base):
    class Meta:
        model = models.Page
        fields = '__all__'
