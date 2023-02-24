from services import models
from django.db import transaction, utils

tags = models.FacetTag.objects.select_for_update().all()

def run():
    with transaction.atomic():
        marked_for_deletion = []
        for tag in tags:
            prev = tag.value
            normalized_value = (
                prev
                .strip(' \n,')
            )

            try:
                normalized_value = normalized_value[0].upper() + normalized_value[1:]
                with transaction.atomic():
                    if tag.value == normalized_value: continue
                    tag.value = normalized_value
                    print('Tag', tag.id, 'value updated from', prev, 'to', normalized_value)
                    tag.save()
            except (utils.IntegrityError, IndexError) as e:
                marked_for_deletion.append(tag.id)
                # tag.delete()
                print('Tag', tag.id, 'is a duplicate and will be deleted.')
        print('Marked for deletion:', marked_for_deletion)
        tags.filter(id__in=marked_for_deletion).delete()
