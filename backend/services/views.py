from django.shortcuts import render
from rest_framework import viewsets as vs, status
from rest_framework.decorators import action
from rest_framework.response import Response
from . import models, serializers

# from search import client, searchable_fields


class ServiceViewset(vs.ModelViewSet):
    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    filter_fields = '__all__'
    lookup_field = 'slug'

    @action(methods=['get'], detail=False)
    def documents(self, request):
        from search import client
        response = client.index('services').get_documents(
            **request.GET
        )

        return Response(response.__dict__)

    @action(methods=['put'], detail=False)
    def update_search_index(self, request):
        documents = [
            obj.to_document()
            for obj in self.queryset
        ]

        response = None #client.index('services').add_documents(
            #documents, primary_key='id')

        return Response({
            'result': response
        })


class FacetViewset(vs.ModelViewSet):
    queryset = models.Facet.objects.all()
    serializer_class = serializers.FacetSerializer
    filter_fields = '__all__'
