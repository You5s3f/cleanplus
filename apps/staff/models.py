from django.db import models

class FemmeMenage(models.Model):
    STATUT_CHOICES = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    nom_complet = models.CharField(max_length=160)
    telephone = models.CharField(max_length=30)
    ville_zone = models.CharField(max_length=120, blank=True)
    experience = models.PositiveIntegerField(default=0, help_text="Années d'expérience")
    zones_couvertes = models.CharField(max_length=255, blank=True, help_text="Ex: Casablanca, Mohammedia, ...")
    photo = models.ImageField(upload_to="staff/", null=True, blank=True)
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default="ACTIVE")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    disponible = models.BooleanField(default=True)
    tarif_horaire = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.nom_complet
