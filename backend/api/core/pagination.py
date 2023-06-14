from rest_framework import pagination
from rest_framework.response import Response


class CustomPagination(pagination.PageNumberPagination):
    page_size_query_param = 'size'

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
