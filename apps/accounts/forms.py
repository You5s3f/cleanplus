from django import forms
from django.contrib.auth.forms import AuthenticationForm

class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Utilisateur", widget=forms.TextInput(attrs={"placeholder": "admin"}))
    password = forms.CharField(label="Mot de passe", widget=forms.PasswordInput(attrs={"placeholder": "••••••••"}))
