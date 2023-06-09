from os import getenv
from pathlib import Path
import dj_database_url


def _to_list(variable, split_char = " "):
    lst = []
    if tokens := getenv(variable):
        for token in tokens.split(split_char):
            if token := token.strip():
                lst.append(token)
    return lst

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = getenv('SECRET_KEY')

DEBUG = getenv('DEBUG', False)

INTERNAL_IPS = [
    '127.0.0.1',
]

ALLOWED_HOSTS = _to_list('ALLOWED_HOSTS')

CSRF_TRUSTED_ORIGINS =_to_list('CSRF_TRUSTED_ORIGINS')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',

    # customs
    'django_extensions',
    'rest_framework',
    'django_ufilter',
    'cloudinary_storage',
    'cloudinary',
    'mdeditor',
    'flat_json_widget',
    'jsoneditor',
    'django_admin_geomap',
    'solo',

    # my apps
    'pages',
    'services',
    'search',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

ROOT_URLCONF = 'api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASE_URL = getenv('DATABASE_URL')
DATABASES = {
    "default": dj_database_url.config()
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Toronto'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'data/staticfiles'
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'data/mediafiles'

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Installed apps

# rest_framework
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'api.core.pagination.CustomPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': ['django_ufilter.integrations.drf.DRFFilterBackend']
}

# meilisearch
MEILISEARCH = {
    'HOST': getenv('MEILISEARCH_HOST'),
    'KEY': getenv('MEILISEARCH_KEY', SECRET_KEY)
}

# dj3-cloudinary-storage

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': getenv('CLOUDINARY_API_SECRET'),
}

# django-mdeditor
X_FRAME_OPTIONS = 'SAMEORIGIN'
MEDIA_ROOT = BASE_DIR / 'uploads'

# see: https://github.com/pylixm/django-mdeditor#customize-the-toolbar
MDEDITOR_CONFIGS = {
    'default': {
        'language': 'en'
    }

}

# django-jsoneditor
# JSON_EDITOR_CSS = str(BASE_DIR / 'services' / 'templates' / 'json_editor.css')

# django shell
NOTEBOOK_ARGUMENTS = [
    '--allow-root',
    '--no-browser'
]