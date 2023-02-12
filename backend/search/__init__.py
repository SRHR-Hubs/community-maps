import meilisearch
from api.settings import MEILISEARCH as settings

client = meilisearch.client.Client(
    settings['HOST'],
    settings['KEY']
)

searchable_fields = ['name', 'slug']
filterable_fields = ['tags']


def create_index(index):
    try:
        try:
            client.create_index(index)
        except meilisearch.errors.MeiliSearchApiError:
            pass
        try:
            client.index(index).update_searchable_attributes(
                searchable_fields
            )
        except meilisearch.errors.MeiliSearchApiError:
            pass
        try:
            client.index(index).update_filterable_attributes(
                filterable_fields
            )
        except meilisearch.errors.MeiliSearchApiError:
            pass

        return client.index(index)
    except:
        raise


create_index('services')
