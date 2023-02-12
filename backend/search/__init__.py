import meilisearch
from api.settings import MEILISEARCH as settings

client = meilisearch.client.Client(
    settings['HOST'],
    settings['KEY']
)

searchable_fields = ['name', 'slug']
filterable_fields = ['tags']

# try:
#     client.create_index('services')
#     client.index('services').update_searchable_attributes(
#         searchable_fields
#     )
#     client.index('services').update_filterable_attributes(
#         filterable_fields
#     )
# except meilisearch.errors.MeiliSearchApiError:
#     pass
# except:
#     raise
