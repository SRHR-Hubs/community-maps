def phone_numbers(): return {
    'default': {
        'primary': None
    }
}

def socials(): return {
    'default': {
        'twitter': None
    }
}

def hours(): return {
    'default': {
        key: None for key in [
            'Sunday', 'Monday', 
            'Tuesday', 'Wednesday',
            'Thursday', 'Friday',
            'Saturday', 'extra'
        ]
    }
}

def extra(): return {
    'default': {
        'primary': None
    }
}