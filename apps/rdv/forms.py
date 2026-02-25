from django import forms
from django.core.exceptions import ValidationError
from datetime import timedelta

from .models import RendezVous
from apps.staff.models import FemmeMenage


class RendezVousForm(forms.ModelForm):
    """
    Form RDV admin
    ✅ Femmes: ACTIVE + disponible=True
    ✅ datetime-local
    ✅ Anti double réservation (overlap)
    """
    date_heure = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
        input_formats=["%Y-%m-%dT%H:%M"],
        label="Date et heure"
    )

    class Meta:
        model = RendezVous
        fields = ["demande", "service", "femme", "date_heure", "duree_minutes", "adresse", "statut"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # ✅ uniquement femmes actives + disponibles
        self.fields["femme"].queryset = FemmeMenage.objects.filter(
            statut="ACTIVE",
            disponible=True
        ).order_by("nom_complet")

        self.fields["femme"].empty_label = "— Non assignée —"

    def clean(self):
        cleaned = super().clean()

        femme = cleaned.get("femme")
        date_heure = cleaned.get("date_heure")
        duree = cleaned.get("duree_minutes") or 0
        statut = cleaned.get("statut")

        # Si pas de femme => pas de conflit à checker
        if not femme or not date_heure or duree <= 0:
            return cleaned

        # On vérifie seulement les RDV "actifs"
        BUSY = {"PLANIFIE", "EN_COURS"}
        if statut not in BUSY:
            return cleaned

        start = date_heure
        end = date_heure + timedelta(minutes=int(duree))

        # RDV existants de la même femme, actifs
        qs = RendezVous.objects.filter(
            femme=femme,
            statut__in=BUSY,
        )

        # Si update, exclure le RDV courant
        if self.instance and self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)

        # Chevauchement: start < other_end AND end > other_start
        for other in qs:
            other_start = other.date_heure
            other_end = other.date_heure + timedelta(minutes=int(other.duree_minutes or 0))

            if start < other_end and end > other_start:
                raise ValidationError(
                    f"Conflit: cette femme a déjà un RDV ({other_start:%Y-%m-%d %H:%M}) "
                    f"qui chevauche ce créneau."
                )

        return cleaned
