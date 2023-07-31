from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

import itertools as it

Base = FlexFieldsModelSerializer


class FacetSerializer(Base):
    translations = serializers.SerializerMethodField()

    def get_translations(self, obj):
        requested_languages = [
            lang.removeprefix('translations.')
            for lang in self.context['request'].query_params.getlist('fields')
            if lang.startswith('translations.')
        ]
        if requested_languages:
            qs = obj.translations.filter(language__in=requested_languages)
        else:
            qs = obj.translations.all()

        return {
            trans.language: trans.text
            for trans in qs
        }

    class Meta:
        model = models.Facet
        exclude = ('_description',)


class TagSerializer(Base):
    facet = serializers.SerializerMethodField()

    def get_facet(self, obj):
        # TODO: multilingual
        # serialized = FacetSerializer(obj.facet, context=self.context).data
        return {
            "id": obj.facet.id,
            # serialized["translation_id"],
            "translation_id": obj.facet.translation_id,
            "name": obj.facet.translations.get(language="en").text
        }

    class Meta:
        model = models.FacetTag
        fields = ('id', 'facet', 'value', 'extra')


class LocationSerializer(Base):
    class Meta:
        model = models.Location
        exclude = ('id', 'service')


class ServiceSerializer(Base):
    hours = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    location = LocationSerializer(many=False, read_only=True)

    def get_hours(self, obj):
        return [
            (item['key'], item['value'])
            for item in obj.hours
        ]

    def get_tags(self, obj):
        ret = {}

        for key, tags in it.groupby(
                obj.tags.order_by('facet__translation_id'),
                key=lambda t: t.facet.translation_id):
            ret[key] = [tag.value for tag in tags]

        return ret

    class Meta:
        model = models.Service
        exclude = ('_contact',)
