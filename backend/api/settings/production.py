import logging
from pathlib import Path

from dotenv import load_dotenv

from .base import *

print(f"Loading settings: {__file__}")

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(
    BASE_DIR / '.env.production',
    verbose=True,
    override=False
)
