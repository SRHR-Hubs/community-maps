from django.db import models
from mdeditor.fields import MDTextField
from django.contrib.auth import get_user_model

User = get_user_model()


class PageBase(models.Model):
    # django metadata
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField()
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL)
    published = models.BooleanField(default=False)

    # opengraph metadata
    # TODO see more
    title = models.CharField(max_length=31)
    slug = models.CharField(unique=True, max_length=255) # not slug to allow for spaces
    description = models.CharField(max_length=255)
    image = models.URLField(blank=True)

    # content, powered by mdx
    content = MDTextField(blank=True)

    class Meta:
        abstract = True

class BlogPost(PageBase):
    def __str__(self):
        return f'/{self.title}'

class Page(PageBase):
    def __str__(self):
        return f'/{self.slug}'