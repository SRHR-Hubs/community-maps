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

    @action(methods=['get'], detail=False)
    def geojson(self, request):
        response = {
            "type": "geojson",
        }
        data = {
            "type": "FeatureCollection",
            "features": []
        }

        qs = self.filter_queryset(self.get_queryset())

        for item in qs.filter(location__isnull=False):
            data["features"].append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [
                    item.location.longitude,
                    item.location.latitude
                ]},
                "properties": {
                    "slug": item.slug,
                    "name": item.name,
                    "description": item.description
                }
            })

        response["data"] = data

        return Response(response)

    @action(methods=['put'], detail=False)
    def update_search_index(self, request):
        from search import client, create_index
        documents = [
            obj.to_document()
            for obj in self.get_queryset().filter(published=True)
        ]

        new_index = create_index('services_new')

        new_index.add_documents(
            documents, primary_key='id')

        response = client.swap_indexes(
            [{'indexes': ['services', 'services_new']}])

        new_index.delete()

        return Response({
            'result': response
        })


class FacetViewset(vs.ModelViewSet):
    queryset = models.Facet.objects.all()
    serializer_class = serializers.FacetSerializer
    filter_fields = '__all__'
    lookup_field = 'translation_id'

    @action(detail=True)
    def distribution(self, request, translation_id=None):
        obj = self.get_object()
        return Response(obj.distribution)
