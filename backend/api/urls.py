from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

import blog.views
import services.views

router = routers.DefaultRouter()
for prefix, viewset in [
    ('blog', blog.views.BlogPostViewset),
    ('services', services.views.ServiceViewset),
    ('facets', services.views.FacetViewset),
]:
    router.register(prefix, viewset)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls'))
]
