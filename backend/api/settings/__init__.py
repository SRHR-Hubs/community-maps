from os import getenv

if getenv('DJANGO_SETTINGS_MODULE', 'api.settings') == 'api.settings':
    from .development import *