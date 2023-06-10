from pathlib import Path

from dotenv import load_dotenv

print(f"Loading settings: {__file__}")

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(
    BASE_DIR / '.env.staging',
    verbose=True,
    override=False
)

from .base import *