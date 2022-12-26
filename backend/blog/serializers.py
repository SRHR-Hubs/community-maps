from rest_framework import serializers

from . import models

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BlogPost
        fields = '__all__'