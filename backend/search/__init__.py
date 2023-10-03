import meilisearch
from django.conf import settings

class MeiliClient(meilisearch.client.Client):
    def refresh(self, index_id, documents, primary_key='id'):
        print("Refreshing", index_id)
        settings = self.index(index_id).get_settings()
        new_index_id = index_id + '_new'

        jobs = {
            'create': self.create_index(new_index_id),
        }

        new_index = self.index(new_index_id)
        new_index.update_settings(settings)
        new_index.add_documents(
            documents, primary_key=primary_key
        )

        jobs = {
            **jobs,
            'swap': self.swap_indexes([
                {'indexes': [index_id, new_index_id]}
            ]),
            'delete': self.index(new_index_id).delete()
        }

        return {
            'jobs': jobs
        }
        

client = MeiliClient(
    settings.MEILISEARCH['HOST'],
    settings.MEILISEARCH['KEY']
)

errors = meilisearch.errors
