import meilisearch
from django.conf import settings

client = meilisearch.client.Client(
    settings.MEILISEARCH['HOST'],
    settings.MEILISEARCH['KEY']
)


def refresh_client(_id, documents, primary_key='id'):
    settings = client.index(_id).get_settings()

    _new_id = _id + '_new'

    _create_index = client.create_index(_new_id)
    new_index = client.index(_new_id)
    print(_id, _new_id)
    print(new_index)
    new_index.update_settings(settings)
    new_index.add_documents(
        documents, primary_key=primary_key
    )

    _swap = client.swap_indexes([
        {'indexes': [_id, _new_id]}
    ])


    _delete = new_index.delete()

    return {
        'jobs': {
            'create': _create_index,
            'swap': _swap,
            'delete': _delete
        }
    }


errors = meilisearch.errors
