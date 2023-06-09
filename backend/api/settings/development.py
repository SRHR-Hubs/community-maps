import logging
from pathlib import Path

from dotenv import load_dotenv


print(f"Loading settings: {__file__}")

BASE_DIR = Path(__file__).resolve().parent.parent.parent

assert load_dotenv(
    BASE_DIR / '.env.local',
    verbose=True,
    override=False
)

from .base import *

SECRET_KEY = getenv('INSECURE_LOCAL_KEY')

ALLOWED_HOSTS += [
    'localhost',
    '127.0.0.1',
    '[::1]'
]
