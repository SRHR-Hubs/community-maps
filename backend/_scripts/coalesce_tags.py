from collections import defaultdict
from curses.ascii import islower
import itertools
import random
import re
from services import models
from django.db import transaction, utils

tags = models.FacetTag.objects.select_for_update().all()


def _write_ngrams():
    qs = [tag.value.strip('\r\n().,-').split(' ') for tag in
          models.FacetTag.objects
          .filter(value__gt='')
          .order_by('value')
          .distinct('value')
          ]
    n_grams = set()
    for n in range(10, 0, -1):
        for tokens in qs:
            for i in range(0, len(tokens) - n + 1):
                substr = tokens[i:i+n]
                if not all(token.isalpha() and not token.islower() for token in tokens[i:i+n]):
                    continue
                substr = " ".join(substr)
                # if any(substr.startswith(k := token) and len(token.split()) > 1 for token in n_grams):
                #     print(f'skipping {substr}; prefix {k}')

                n_grams.add(substr)
    with open('_scripts/output/keep_caps_ngrams.txt', 'w+') as f:
        for x in sorted(n_grams, key=len, reverse=True):
            f.write(f'{x}\n')


def run():

    with open('_scripts/output/_edited_keep_caps_ngrams.txt') as f:
        preserve_caps = [ln.strip()
                         for ln in f if len(ln) > 0 and not ln.startswith('#')]
    

    def normalize(value):
        value = re.sub(r'\r\n', '', value.capitalize())
        for token in preserve_caps:
            if value == token:
                break
            if m := re.findall(rf'\b{token}\b', value, flags=re.IGNORECASE):

                for group in m:
                    value = re.sub(rf'\b{group}\b', token, value)
        return value

    with transaction.atomic():
        marked_for_deletion = []
        for tag in tags:
            try:
                normalized_value = normalize(tag.value)
                with transaction.atomic():
                    if tag.value == normalized_value:
                        continue
                    tag.value = normalized_value
                    print('Tag', tag.id, 'updated.')
                    tag.save()
            except (utils.IntegrityError, IndexError) as e:
                marked_for_deletion.append(tag.id)
                # tag.delete()
                print('Tag', tag.id, 'is a duplicate and will be deleted.')
        print('Marked for deletion:', marked_for_deletion)
        # tags.filter(id__in=marked_for_deletion).delete()

        ###########################################################

        #########################################################

        

        return

        # Rae's fixes
        i = 0
        fixes = defaultdict(list)
        for tag in tags:
            value = tag.value.lower()
            match tag.facet.translation_id:
                case "SERVICE_LANGUAGE":
                    i += 1
                    if 'interpret' in value:
                        fixes['should be set to "Access to interpretation services"'].append(
                            (tag.id, tag.value))
                    elif 'translat' in value:
                        fixes['should be set to "Access to translation services"'].append(
                            (tag.id, tag.value))
                case "SERVICE_OFFERED":
                    i += 1
                    if 'anonymous hiv testing' in value:
                        fixes['should be set to "Anonymous HIV testing"'].append(
                            (tag.id, tag.value))
                    elif 'addict' in value:
                        fixes['should be retyped to contain "Substance use support"'].append(
                            (tag.id, tag.value))
                    elif 'advoca' in value:
                        fixes['should be retyped to contain "Advocacy"'].append(
                            (tag.id, tag.value))
                    elif value in ['birth control', 'family planning']:
                        fixes['should be set to "Contraceptive care ("birth control")"'].append(
                            (tag.id, tag.value))
                    elif any(x in value for x in ['birth control', 'family planning']):
                        fixes['should be retyped to contain "Contraceptive ("birth control")"'].append(
                            (tag.id, tag.value))
                    elif "depo" in value:
                        fixes['should be retyped to contain "Depo-Provera"'].append(
                            (tag.id, tag.value))
                    elif any(x in value for x in ['ecp', 'emergency contraception']):
                        fixes['should be retyped to contain "Emergency contraception ("morning after" pills)"'].append(
                            (tag.id, tag.value))
                    elif 'free condom' in value and 'lube' in value:
                        fixes['should be split into "Free condoms" and "Free lube"'].append(
                            (tag.id, tag.value))
                    elif 'free condom' in value:
                        fixes['should be set to "Free condoms'].append(
                            (tag.id, tag.value))
                    elif 'genital wart' in value:
                        fixes['should be retyped to include "Genital wart treatment"'].append(
                            (tag.id, tag.value))
                    elif 'harm reduction' in value:
                        fixes['should be retyped to include "Harm reduction supplies"'].append(
                            (tag.id, tag.value))
                    elif 'health counse' in value:
                        fixes['should be set to "Health counselling"'].append(
                            (tag.id, tag.value))
                    elif 'hep a/b' in value or 'hep a & b' in value:
                        fixes['should be retyped to contain "Hepatitis A & B vaccination"'].append(
                            (tag.id, tag.value))
                    elif 'hep' in value and 'vac' in value:
                        fixes['should be retyped to contain "Hepatitis [] vaccination"']
                    elif 'hiv couns' in value:
                        fixes['should be retyped to contain "HIV/AIDS counseling"'].append(
                            (tag.id, tag.value))
                    elif 'hpv vac' in value or 'gardasil' in value:
                        fixes['should be retyped to contain "HPV vaccination"'].append(
                            (tag.id, tag.value))

                    elif any(x in value for x in [
                        'iud',
                        'mental health',
                        'needle',
                        'pap ',
                        'naloxone',
                        'point of care',
                        'preconception',
                        'pregnancy counselling',
                        'pregnancy testing',
                        'safety planning',
                        'cessation'
                    ]):
                        fixes['address capitalization'].append(
                            (tag.id, tag.value))

                    else:

                        i -= 1

        for k, v in fixes.items():
            print(f'{k} ({len(v)}): {v[:5]}{"" if len(v) > 5 else ""}')
        print('\n', i, 'total fixes out of', len(tags), 'tags')

        # raise utils.IntegrityError
