from django.apps import AppConfig


class RdvConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.rdv"

    def ready(self):
        # Import des signals
        from . import signals  # noqa
