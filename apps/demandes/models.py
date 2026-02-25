from django.db import models
from apps.services.models import Service

class DemandeDevis(models.Model):
    STATUT_CHOICES = [
        ("NOUVELLE", "Nouvelle"),
        ("EN_COURS", "En cours"),
        ("TRAITEE", "Traitée"),
        ("ANNULEE", "Annulée"),
    ]

    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, blank=True)
    nom = models.CharField(max_length=120)
    email = models.EmailField(blank=True)
    telephone = models.CharField(max_length=30)
    adresse = models.CharField(max_length=255)

    surface_m2 = models.PositiveIntegerField(null=True, blank=True)
    frequence = models.CharField(max_length=80, blank=True, help_text="Ex: ponctuel, hebdomadaire...")
    date_souhaitee = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True)

    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default="NOUVELLE")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.nom} - {self.telephone}"
