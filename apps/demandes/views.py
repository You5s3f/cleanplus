from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages


from apps.demandes.forms import DemandeDevisForm
from .models import DemandeDevis
from .forms import DemandeDevisAdminForm
from apps.services.models import Service

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q

from .models import DemandeDevis
from .forms import DemandeDevisAdminForm

from django.views.decorators.http import require_POST


@login_required
def list_view(request):
    """
    Admin > Demandes : liste + filtres (recherche + statut)
    """
    q = (request.GET.get("q") or "").strip()
    statut = (request.GET.get("statut") or "").strip()

    qs = DemandeDevis.objects.all()

    if q:
        qs = qs.filter(
            Q(nom__icontains=q) |
            Q(telephone__icontains=q) |
            Q(email__icontains=q) |
            Q(adresse__icontains=q)
        )

    if statut:
        qs = qs.filter(statut=statut)

    items = qs.order_by("-created_at")

    return render(request, "admin/demandes/list.html", {
        "items": items,
        "q": q,
        "statut": statut,
        "statuts": DemandeDevis.STATUT_CHOICES,
    })


@login_required
def detail_view(request, pk):
    """
    Admin > Détail d'une demande
    """
    demande = get_object_or_404(DemandeDevis, pk=pk)
    return render(request, "admin/demandes/detail.html", {"demande": demande})


@login_required
def update_status(request, pk):
    """
    Admin > Changer statut rapidement (POST)
    """
    demande = get_object_or_404(DemandeDevis, pk=pk)

    if request.method == "POST":
        new_status = (request.POST.get("statut") or "").strip()
        valid_status = {s[0] for s in DemandeDevis.STATUT_CHOICES}

        if new_status in valid_status:
            demande.statut = new_status
            demande.save(update_fields=["statut"])
            messages.success(request, "Statut mis à jour ✅")
        else:
            messages.error(request, "Statut invalide.")

    return redirect("demandes:detail", pk=pk)


@login_required
def create_view(request):
    """
    Admin > Créer une demande manuellement (optionnel)
    """
    if request.method == "POST":
        form = DemandeDevisAdminForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Demande créée avec succès ✅")
            return redirect("demandes:list")
    else:
        form = DemandeDevisAdminForm()

    return render(request, "admin/demandes/create.html", {"form": form})


def home(request):
    return render(request, "public/home.html")

def services_page(request):
    services = Service.objects.filter(actif=True).order_by("nom")
    return render(request, "public/services.html", {"services": services})

def devis(request):
    """
    Page devis public :
    - GET : affiche le formulaire
    - POST : sauvegarde en DB puis redirige vers page succès
    """
    if request.method == "POST":
        form = DemandeDevisForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("public:devis_success")
    else:
        form = DemandeDevisForm()

    return render(request, "public/devis.html", {"form": form})

def devis_success(request):
    return render(request, "public/devis_success.html")

def contact(request):
    return render(request, "public/contact.html")

def about(request):
    return render(request, "public/about.html")

@login_required
@require_POST
def demandes_delete(request, pk):
    demande = get_object_or_404(DemandeDevis, pk=pk)
    demande.delete()
    messages.success(request, "La demande a été supprimée avec succès.")
    return redirect("demandes:list")