from django.shortcuts import render
from rest_framework import viewsets as vs, status
from rest_framework.decorators import action
from rest_framework.response import Response
from . import models, serializers
from search import client

# from search import client, searchable_fields


class ServiceViewset(vs.ModelViewSet):
    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    filter_fields = '__all__'
    lookup_field = 'slug'

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

    @action(methods=['get', 'put'], detail=False)
    def documents(self, request):
        config = client.index('services').get_settings()

        searchable_fields = config.get('searchableAttributes', [])

        if searchable_fields == ['*']:
            raise NotImplemented
            searchable_fields = models.Service._meta.fields

        qs = self.filter_queryset(self.get_queryset())

        documents = []

        for obj in qs:
            flat_tags = []
            for tag in obj.tags.all():
                flat_tags.append({
                    'id': tag.id,
                    tag.facet.translation_id: tag.value
                })

            fields = {
                field: getattr(obj, field)
                for field in searchable_fields
            }

            documents.append({
                'id': obj.id,
                **fields,
                'tags': flat_tags
            })

        if request.method == 'PUT':
            if request.query_params.get('published') != "1":
                return Response({
                    'error': 'Cannot upload unpublished services to search index.',
                }, status=400)

            new_index_job = client.create_index('services_new')

            new_index = client.index('services_new')
            new_index.update_settings(config)
            new_index.add_documents(
                documents, primary_key='id'
            )

            response = {
                'create_job': new_index_job,
                'swap_job': client.swap_indexes([
                    {'indexes': ['services', 'services_new']}
                ]),
                'delete_job': new_index.delete()
            }

            return Response(response)
        else:
            assert request.method == 'GET'
            return Response(documents)


class FacetViewset(vs.ModelViewSet):
    queryset = models.Facet.objects.all()
    serializer_class = serializers.FacetSerializer
    filter_fields = '__all__'
    lookup_field = 'translation_id'

    @action(detail=True)
    def distribution(self, request, translation_id=None):
        obj = self.get_object()
        return Response(obj.distribution)

    @action(methods=['get', 'put'], detail=False)
    def documents(self, request):
        q_published = request.query_params.get('published', "1")
        config = client.index('facets').get_settings()

        searchable_fields = config.get('searchableAttributes', [])

        if searchable_fields == ['*']:
            raise NotImplemented
            searchable_fields = models.Service._meta.fields

        qs = self.get_queryset().distinct()

        documents = []

        for facet in qs:
            values = self.filter_queryset(models.FacetTag.objects.filter(
                facet=facet,
                service__published=q_published
            )
                .order_by('value')
                .distinct('value')
                .values_list('value', flat=True)
            )

            fields = {
                field: getattr(facet, field, None)
                for field in searchable_fields
            }

            documents.append({
                'id': facet.translation_id,
                **fields,
                'value': list(values),
            })

        if request.method == 'PUT':
            if q_published != "1":
                return Response({
                    'error': 'Cannot upload facets from unpublished services to search index.',
                }, status=400)

            new_index_job = client.create_index('facets_new')

            new_index = client.index('facets_new')
            new_index.update_settings(config)
            new_index.add_documents(
                documents, primary_key='id'
            )

            response = {
                'create_job': new_index_job,
                'swap_job': client.swap_indexes([
                    {'indexes': ['facets', 'facets_new']}
                ]),
                'delete_job': new_index.delete()
            }

            return Response(response)

        assert request.method == 'GET'
        return Response({
                'results': documents,
                'meta': {
                    'total': sum(
                        len(facet['value']) for facet in documents
                    )
                }
            })
