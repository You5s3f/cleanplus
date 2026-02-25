from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods


@require_http_methods(["GET", "POST"])
def login_view(request):
    """
    Login simple, moderne.
    - GET : affiche formulaire
    - POST : authentifie + redirect
    """
    # Si déjà connecté => dashboard direct
    if request.user.is_authenticated:
        return redirect("dashboard:index")

    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # redirect "next" si présent
            next_url = request.GET.get("next")
            return redirect(next_url or "dashboard:index")

        messages.error(request, "Nom d’utilisateur ou mot de passe incorrect.")

    return render(request, "accounts/login.html")


@require_http_methods(["GET", "POST"])
def logout_view(request):
    """
    Logout avec page de confirmation:
    - GET : affiche confirmation
    - POST : logout + redirect home
    """
    # si pas connecté => login
    if not request.user.is_authenticated:
        return redirect("accounts:login")

    if request.method == "POST":
        logout(request)
        return redirect("accounts:login")
  # ou "accounts:login" si tu préfères

    return render(request, "accounts/logout.html")
