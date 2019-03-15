# -*- coding: utf-8 -*-
import os
import sys

import django

DIRNAME=os.path.dirname(__file__)


def pytest_configure():
    sys.path.append(DIRNAME)  # for testapp
    from django.conf import settings
    settings.configure(
        DEBUG=True,
        TESTING=True,
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
                'NAME': 'testing.db',  # Or path to database file if using sqlite3.
                # The following settings are not used with sqlite3:
                'USER': '',
                'PASSWORD': '',
                'HOST': '',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
                'PORT': '',  # Set to empty string for default.
            }
        },
        INSTALLED_APPS=(
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.admin',
            'dkjs',
            'testapp',
        )
    )
    django.setup()
    from django.core.management import call_command
    call_command('migrate', interactive=False)
