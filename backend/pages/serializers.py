from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

Base = FlexFieldsModelSerializer


class I18nSectionSerializer(Base):
    class Meta:
        model = models.I18nSection
        exclude = ('id',)


class PageBaseSerializer(serializers.Serializer):
    pass

    # any common functionality will go here


class BlogPostSerializer(PageBaseSerializer, Base):
    class Meta:
        model = models.BlogPost
        fields = '__all__'


class PageSerializer(PageBaseSerializer, Base):
    content = serializers.SerializerMethodField()

    def get_content(self, obj):
        prefix = f'pages.{obj.slug}.sections.'
        qs = obj.content.filter(translation_id__startswith=prefix)
        res = {}

        for section in qs:
            key = section.translation_id.removeprefix(prefix)
            res[key] = section.text

        return res

        # return I18nSectionSerializer(
        #     obj.content.filter(translation_id__contains='.sections.'),
        #     many=True).data

    class Meta:
        model = models.Page
        fields = '__all__'
