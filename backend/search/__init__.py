import meilisearch
from api.settings import MEILISEARCH as settings

client = meilisearch.client.Client(
    settings['HOST'],
    settings['KEY']
)

errors = meilisearch.errors
