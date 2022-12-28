phone_numbers = {
    'default': {
        'primary': None
    },
    'help_text': "Example keys: 'primary', 'emergency', etc.",
}

socials = {
    'default': {
        'twitter': None
    },
    'verbose_name': 'Social media',
    'help_text': "Example keys: 'twitter', 'instagram', etc."
}

hours = {
    'default': {
        key: None for key in [
            'Sunday', 'Monday',
            'Tuesday', 'Wednesday',
            'Thursday', 'Friday',
            'Saturday', 'extra'
        ]
    },
    'verbose_name': 'Opening hours',
    'help_text': "Example keys: 'monday', 'tuesday', 'note', 'alert', etc.",
}

extra = {
    'default': {},
}

blank_service = {
    'published': False,
    'name': 'DELETED_SERVICE',
    'slug': 'DO_NOT_PUBLISH__DELETED_SERVICE',
}
