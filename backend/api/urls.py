from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

import blog.views

router = routers.DefaultRouter()
for prefix, viewset in [
    ('blog', blog.views.BlogPostViewset),
]:
    router.register(prefix, viewset)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls'))
]
