def _ordered_key_value_list_schema(
        key_placeholder,
        value_placeholder):
    return {
        'type': 'array',
        'items': {
            'type': 'dict',
            'keys': {
                'key': {
                    'type': 'string',
                    'placeholder': key_placeholder
                },
                'value': {
                    'type': 'string',
                    'placeholder': value_placeholder
                }
            },
        }
    }

PHONE_NUMBERS_SCHEMA = _ordered_key_value_list_schema(
    'Primary', '(xxx)-xxx-xxxx'
)
SOCIALS_ADMIN_SCHEMA = _ordered_key_value_list_schema(
    'Twitter', '@srhrhubs'
)
HOURS_ADMIN_SCHEMA = _ordered_key_value_list_schema(
    'Monday', '10am-3pm'
)

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
        'hours': [
            [key, "test"] for key in
            ['Monday', 'Tuesday',]
        ]
    },
    'verbose_name': 'Opening hours',
    'help_text': "Example keys: 'Monday', 'Tuesday', 'Weekdays'...",
}

extra = {
    'default': {},
}

blank_service = {
    'published': False,
    'name': 'DELETED_SERVICE',
    'slug': 'DO_NOT_PUBLISH__DELETED_SERVICE',
}
