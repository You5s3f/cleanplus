from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import RendezVous


BUSY_STATUSES = {"PLANIFIE", "EN_COURS"}   # RDV actifs => femme occupée
FREE_STATUSES = {"TERMINE", "ANNULE"}      # RDV finis => femme libérée


def _refresh_femme_disponibilite(femme):
    """
    Met à jour femme.disponible selon ses RDV actifs.
    """
    if not femme:
        return

    has_busy = RendezVous.objects.filter(
        femme=femme,
        statut__in=BUSY_STATUSES
    ).exists()

    # si au moins un RDV actif => indisponible, sinon disponible
    femme.disponible = not has_busy
    femme.save(update_fields=["disponible"])


@receiver(post_delete, sender=RendezVous)
def rdv_deleted(sender, instance, **kwargs):
    """
    Si un RDV est supprimé, on re-calcule la disponibilité de la femme.
    """
    _refresh_femme_disponibilite(instance.femme)
