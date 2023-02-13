import rest_framework.viewsets as vs
from rest_framework.response import Response
from collections import defaultdict


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
    lookup_field = 'language'
    filter_fields = '__all__'

    def retrieve(self, request, language=None):
        def nested_dict(): return defaultdict(nested_dict)
        response = nested_dict()

        qs = self.filter_queryset(self.get_queryset())

        for item in qs.filter(language=language):
            *namespaces, _id = item.translation_id.split('.')
            # create dict keys recursively to drill down to the namespace
            curr = response
            for key in namespaces or ['common']:
                curr = curr[key]
            curr[_id] = item.text

        return Response(response)
