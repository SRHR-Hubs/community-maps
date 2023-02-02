from django.shortcuts import render
import rest_framework.viewsets as vs

from . import models, serializers


class BlogPostViewset(vs.ModelViewSet):
    queryset = models.BlogPost.objects.all()
    serializer_class = serializers.BlogPostSerializer
    lookup_field = 'slug'
    filter_fields = '__all__'


class PageViewset(vs.ModelViewSet):
    queryset = models.Page.objects.all()
    serializer_class = serializers.PageSerializer
    lookup_field = 'slug'
    filter_fields = '__all__'


class I18nSectionViewset(vs.ModelViewSet):
    queryset = models.I18nSection.objects.all()
    serializer_class = serializers.I18nSectionSerializer
    lookup_field = 'translation_id'
    filter_fields = '__all__'
