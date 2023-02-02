import requests
import json
from time import sleep

API_URL = "https://geocode.maps.co/search"


def run():
    unsuccessful = []
    try:
        session = requests.Session()
        session.hooks = {
            'response': lambda r, *args, **kwargs: r.raise_for_status() or sleep(1)
        }
        with open('_notebooks/output/_data.json') as f, open('_scripts/output/geolocations.txt', 'w+') as w:
            for obj in map(json.loads, f):
                _id = obj['id']
                addr = obj['address']

                if not addr: continue

                result = None
                # try each token for a hit
                for token in addr.split(';'):
                    res = session.get(API_URL, params={'q': token + " Toronto"}).json()
                    for loc in res:
                        if 'Toronto' in loc['display_name']:
                            result = loc
                            w.write(f'Service {_id} lat = {loc["lat"]} lon = {loc["lon"]}\n')
                            print(f'Service {_id} lat = {loc["lat"]} lon = {loc["lon"]}')
                            break
                    if result: break
                if not result:
                    print(f'Service {_id} could not have a location set.')
                    unsuccessful.append(_id)
                    continue
                
                # location, _location_created = models.Location.objects.update_or_create(
                #     service = service,
                #     address = addr.replace(';', '\n'),
                #     latitude = float(loc['lat']),
                #     longitude = float(loc['lon'])
                # )

                # print(f'Service {_id} location set successfully (id: {location.id})')

        print('Unsuccessful:')
        print(unsuccessful)

    except Exception as e:
        print('Transaction failed')
        print(e)