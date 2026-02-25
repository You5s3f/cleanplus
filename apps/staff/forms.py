from django import forms
from .models import FemmeMenage


class FemmeMenageForm(forms.ModelForm):
    class Meta:
        model = FemmeMenage
        fields = [
            "nom_complet",
            "telephone",
            "ville_zone",
            "zones_couvertes",
            "experience",
            "photo",
            "disponible",
            "tarif_horaire",
            "statut",
            "notes",
        ]
        widgets = {
            "notes": forms.Textarea(attrs={"rows": 4}),
        }
