from services import models
from django.db import DatabaseError, transaction
from django.utils.text import slugify
import json
import re
import itertools as it

"""The worst ad-hoc script I may have ever written.
Populates database from a massaged json file created by an IPython notebook.
"""

blankable_fields = [field.attname for field in models.Service._meta.get_fields() 
if getattr(field, 'blank', False)]


def run():
    slugs = []
    print(blankable_fields)
    try:
        with open('_notebooks/output/_data.json') as f, transaction.atomic():
            for obj in map(json.loads, f):
                params = {k: v
                          for k, v in obj.items() if k not in ('tags', 'extra')}

                for k in blankable_fields:
                    if k not in params: continue
                    elif not params[k]:
                        if k in ('socials', 'hours'):
                            params[k] = dict()
                        else:
                            params[k] = ""

                slug = slugify(params['name'], allow_unicode=False)[
                    :50].rstrip('-')
                if slug in slugs:
                    slugs.append(slug)
                    slug = slug[:48].rstrip(
                        '-') + '-' + str((slugs.count(slug) - 1))

                slugs.append(slug)
                params['slug'] = slug

                # make list params dicts
                if params['telephone_numbers']:
                    numbers = {}
                    for i, number in zip(it.chain(['primary'], map(lambda s: f'number {s}', it.count(1))), params['telephone_numbers']):
                        numbers[i] = number.strip()
                    params['phone_numbers'] = numbers
                del params['telephone_numbers']

                if params['socials']:
                    socials = {}
                    for link in params['socials']:
                        link = link.strip()
                        if not link:
                            continue
                        known = ('instagram', 'twitter',
                                 'linkedin', 'facebook', 'youtube')
                        unknown = 1
                        try:
                            social_type = next(k for k in known if k in link)
                            socials[social_type] = link
                        except StopIteration:
                            socials[f'unknown-{unknown}'] = link
                            unknown += 1
                    params['socials'] = socials

                # todo this sucks
                if params['hours']:
                    hours = {}
                    for i, ln in enumerate(params['hours'], 1):
                        hours[f'line-{i}'] = ln.strip()
                    params['hours'] = hours

                if params['address']:
                    params['address'] = params['address'].replace(';', '\n')

                tags = set()
                extra = {}

                if obj['tags']:
                    # work on tags and extras
                    for facet, value_list in obj['tags'].items():
                        if value_list is None:
                            continue
                        for v in value_list:
                            tags.add((facet.removeprefix('tags.'), v))

                    # params['tags'] = tags

                if obj['extra']:
                    extra = {k.removeprefix(
                        'extra.'): v for k, v in obj['extra'].items()}
                  # params['extra'] = extra

                # let's do this thing
                service, _service_updated = models.Service.objects.update_or_create(
                    id=params['id'],
                    defaults=params)
                service.extra = extra

                for facet_name, value in tags:
                    facet, _facet_created = models.Facet.objects.get_or_create(
                        translation_id=facet_name
                    )

                    tagging, _tag_created = models.FacetTag.objects.update_or_create(
                        service=service,
                        facet=facet,
                        value=value
                    )

                print('Service', service.id, 'saved successfully!')

    except DatabaseError as e:
        print('Transaction failed')
        print(e)
        print(params)
