from django.db import models
from apps.services.models import Service
from apps.demandes.models import DemandeDevis
from apps.staff.models import FemmeMenage

class RendezVous(models.Model):
    STATUT_CHOICES = [
        ("PLANIFIE", "Planifié"),
        ("CONFIRME", "Confirmé"),
        ("TERMINE", "Terminé"),
        ("ANNULE", "Annulé"),
    ]

    demande = models.ForeignKey(DemandeDevis, on_delete=models.SET_NULL, null=True, blank=True)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    femme = models.ForeignKey(FemmeMenage, on_delete=models.SET_NULL, null=True, blank=True)

    date_heure = models.DateTimeField()
    duree_minutes = models.PositiveIntegerField(default=120)
    adresse = models.CharField(max_length=255)

    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default="PLANIFIE")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_heure"]

    def __str__(self):
        return f"RDV {self.date_heure:%Y-%m-%d %H:%M} - {self.adresse}"
