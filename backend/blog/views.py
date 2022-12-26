from django.shortcuts import render
import rest_framework.viewsets as vs

from . import models, serializers

# Create your views here.
class BlogPostViewset(vs.ModelViewSet):
    queryset = models.BlogPost.objects.all()
    serializer_class = serializers.BlogPostSerializer