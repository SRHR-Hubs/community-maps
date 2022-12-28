from django.shortcuts import render
import rest_framework.viewsets as vs

from . import models, serializers


class ServiceViewset(vs.ModelViewSet):
    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer


class FacetViewset(vs.ModelViewSet):
    queryset = models.Facet.objects.all()
    serializer_class = serializers.FacetSerializer
