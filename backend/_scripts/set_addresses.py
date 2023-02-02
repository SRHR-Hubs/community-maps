from services import models
from django.db import transaction
import json
d = {}

with open('_scripts/output/_geolocations.txt') as f:
    for tkns in map(str.split, f):
        _id = int(tkns[1])
        lat = round(float(tkns[4]), 7)
        lon = round(float(tkns[7]), 7)
        
        d[_id] = (lat, lon)

addresses = open('_notebooks/output/_data.json').readlines()

def run():
    with transaction.atomic():
        for service in models.Service.objects.all():
            addr = json.loads(addresses[service.id - 1])
            assert addr['id'] == service.id
            if service.id in d:
                lat, lon = d[service.id]
                _loc = models.Location.objects.create(
                    id=service.id,
                    service=service,
                    address=addr['address'].replace(';','\n'),
                    latitude=lat,
                    longitude=lon
                )
            elif addr['address'] is not None:
                _loc = models.Location.objects.create(
                    id=service.id,
                    service=service,
                    address=addr['address'].replace(';', '\n')
                )
            print(f'Service {service.id} location set successfully (id: {_loc.id})')
