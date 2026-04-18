"""
WSGI config for solar_api project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'solar_api.settings')

# Auto-migrate on Vercel startup
if os.environ.get('VERCEL'):
    try:
        from django.core.management import call_command
        application_temp = get_wsgi_application()
        call_command('migrate', '--run-syncdb', verbosity=0, interactive=False)
    except Exception as e:
        print(f"Auto-migration warning: {e}")

application = get_wsgi_application()
