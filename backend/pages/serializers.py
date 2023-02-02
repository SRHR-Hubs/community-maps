from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

Base = FlexFieldsModelSerializer


class SectionSerializer(Base):
    class Meta:
        abstract = True
        exclude = ('id', 'object_id', 'content_type')


class PageSectionSerializer(SectionSerializer):
    section_id = serializers.CharField(source="translation_id")

    class Meta(SectionSerializer.Meta):
        model = models.PageSection
        exclude = (*SectionSerializer.Meta.exclude, 'translation_id')


class I18nSectionSerializer(Base):
    class Meta:
        model = models.I18nSection
        fields = '__all__'


class PageBaseSerializer(serializers.Serializer):
    content = PageSectionSerializer(many=True)
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
