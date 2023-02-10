from django.db import models
from mdeditor.fields import MDTextField
from django.contrib.auth import get_user_model

User = get_user_model()


class I18nSection(models.Model):
    translation_id = models.CharField(max_length=200, unique=True)
    language = models.CharField(max_length=12, default="en")
    text = models.TextField()

    def __str__(self):
        return f'{{{self.translation_id}}}'

    class Meta:
        ordering = ('id',)



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
    # not slug to allow for spaces
    slug = models.CharField(unique=True, max_length=255)
    description = models.CharField(max_length=255)
    image = models.URLField(blank=True)
    language = models.CharField(max_length=12, default="en")

    class Meta:
        abstract = True
        ordering = ('id',)



class BlogPost(PageBase):
    content = MDTextField()

    def __str__(self):
        return f'{self.title}'


class Page(PageBase):
    def __str__(self):
        return f'/{self.slug}'

    @property
    def content(self):
        prefix = f'pages.{self.slug}'
        return I18nSection.objects.filter(translation_id__startswith=prefix, language=self.language)