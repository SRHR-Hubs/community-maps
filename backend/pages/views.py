from django.shortcuts import render
import rest_framework.viewsets as vs

from . import models, serializers


class BlogPostViewset(vs.ModelViewSet):
    queryset = models.BlogPost.objects.all()
    serializer_class = serializers.BlogPostSerializer
    filter_fields = '__all__'


class PageViewset(vs.ModelViewSet):
    queryset = models.Page.objects.all()
    serializer_class = serializers.PageSerializer
