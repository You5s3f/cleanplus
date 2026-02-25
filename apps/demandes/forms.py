from django import forms
from .models import DemandeDevis

class DemandeDevisForm(forms.ModelForm):
    """
    Formulaire public (Devis en ligne)
    - Enregistre une DemandeDevis
    - 'nom' est rempli via JS (Prénom+Nom)
    - 'message' est rempli via JS (ville, code postal, etc.)
    """
    class Meta:
        model = DemandeDevis
        fields = [
            "service", "nom", "email", "telephone", "adresse",
            "surface_m2", "frequence", "date_souhaitee", "message",
        ]
        widgets = {
            "nom": forms.TextInput(),
            "email": forms.EmailInput(attrs={"placeholder": "ex: nom@email.com"}),
            "telephone": forms.TextInput(attrs={"placeholder": "ex: +212..." }),
            "adresse": forms.TextInput(attrs={"placeholder": "Adresse complète"}),
            "surface_m2": forms.NumberInput(attrs={"min": 10, "max": 10000}),
            "frequence": forms.TextInput(attrs={"placeholder": "Ex: une fois, hebdomadaire..."}),
            "date_souhaitee": forms.DateInput(attrs={"type": "date"}),
            "message": forms.Textarea(attrs={"rows": 4}),
        }

    def clean(self):
        """
        Petit filet de sécurité :
        si JS ne remplit pas nom, on empêche l'envoi.
        """
        cleaned = super().clean()
        nom = (cleaned.get("nom") or "").strip()
        if not nom:
            self.add_error("nom", "Veuillez saisir Prénom et Nom.")
        return cleaned

class DemandeDevisAdminForm(forms.ModelForm):
    class Meta:
        model = DemandeDevis
        fields = "__all__"