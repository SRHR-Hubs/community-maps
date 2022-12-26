from rest_framework import pagination
from rest_framework.response import Response
from api.settings import REST_FRAMEWORK as settings


class CustomPagination(pagination.PageNumberPagination):
    page_size_query_param = 'size'
    max_page_size = settings['PAGE_SIZE']

    def get_paginated_response(self, data):
        return Response({
            'results': data,
            'meta': {
                'count': len(data),
                'total': self.page.paginator.count,
                'total_pages': self.page.paginator.num_pages,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            }
        })
