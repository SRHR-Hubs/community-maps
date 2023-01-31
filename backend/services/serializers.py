from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer

from . import models

Base = FlexFieldsModelSerializer

class FacetTranslationSerializer(Base):
    def to_representation(self, instance):
        return {
            instance.language: instance.value
        }
    class Meta:
        model = models.FacetTranslation
class FacetSerializer(Base):
    translations = FacetTranslationSerializer(many=True)
    class Meta:
        model = models.Facet
        fields = '__all__'


class TagSerializer(Base):
    facet_id = serializers.PrimaryKeyRelatedField(read_only=True)
    facet = serializers.SlugRelatedField(
        read_only=True, slug_field='translation_id')

    class Meta:
        model = models.FacetTag
        fields = ('id', 'facet_id', 'facet', 'value', 'extra')

class LocationSerializer(Base):
    class Meta:
        model = models.Location
        exclude = ('id', 'service')

class ServiceSerializer(Base):

    # 2 hours lost here. Gotta understand reverse relations better.
    tags = TagSerializer(many=True, read_only=True, source='facettag_set')
    location = LocationSerializer(many=False, read_only=True)

    class Meta:
        model = models.Service
        exclude = ('_contact',)
