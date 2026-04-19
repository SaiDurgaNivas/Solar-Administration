"""
WSGI config for solar_api project.
"""

import os
import sys
from pathlib import Path

# Fix for Vercel: append the backend directory to Python path
base_dir = Path(__file__).resolve().parent.parent
if str(base_dir) not in sys.path:
    sys.path.insert(0, str(base_dir))

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'solar_api.settings')

# Initialize Django app first
application = get_wsgi_application()

# Run migrations AFTER app is ready (Vercel /tmp database needs this)
if os.environ.get('VERCEL'):
    try:
        from django.core.management import call_command
        call_command('migrate', '--run-syncdb', verbosity=0, interactive=False)
        print("Vercel: DB migrations applied successfully.")
    except Exception as e:
        print(f"Vercel: Migration warning: {e}")
