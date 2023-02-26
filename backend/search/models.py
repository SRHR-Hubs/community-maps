from django.db import models
from solo.models import SingletonModel


def _default_config():
    return {
        "displayedAttributes": [
            "*"
        ],
        "searchableAttributes": [
            "*"
        ],
        "filterableAttributes": [],
        "sortableAttributes": [],
        "rankingRules":
        [
            "words",
            "typo",
            "proximity",
            "attribute",
            "sort",
            "exactness"
        ],
        "stopWords": [],
        "synonyms": {},
        "distinctAttribute": None,
        "typoTolerance": {
            "enabled": True,
            "minWordSizeForTypos": {
                "oneTypo": 5,
                "twoTypos": 9
            },
            "disableOnWords": [],
            "disableOnAttributes": []
        },
        "faceting": {
            "maxValuesPerFacet": 100
        },
        "pagination": {
            "maxTotalHits": 1000
        }
    }


class MeilisearchConfig(SingletonModel):

    def __str__(self):
        return 'Meilisearch Config'


class SearchIndex(models.Model):
    _rel = models.ForeignKey(MeilisearchConfig, null=True,
                             on_delete=models.SET_NULL,
                             default=MeilisearchConfig.objects.get,
                             related_name='indexes',
                             )

    index_name = models.CharField(max_length=15)
    config = models.JSONField(default=_default_config)

    def __str__(self):
        return f'/{self.index_name}'

    class Meta:
        verbose_name_plural = 'Search Indexes'
