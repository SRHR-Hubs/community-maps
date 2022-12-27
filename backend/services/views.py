from django.shortcuts import render
import rest_framework.viewsets as vs

from . import models, serializers

# Create your views here.
class ServiceViewset(vs.ModelViewSet):
    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer