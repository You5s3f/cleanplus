from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from django.views.decorators.http import require_POST

from .models import FemmeMenage
from .forms import FemmeMenageForm
from apps.rdv.models import RendezVous




@login_required
def list_view(request):
    """
    Admin > Femmes de ménage : liste + filtres
    """
    q = (request.GET.get("q") or "").strip()
    statut = (request.GET.get("statut") or "").strip()
    dispo = (request.GET.get("dispo") or "").strip()  # "1" / "0"

    qs = FemmeMenage.objects.all()

    if q:
        qs = qs.filter(
            Q(nom_complet__icontains=q) |
            Q(telephone__icontains=q) |
            Q(ville_zone__icontains=q) |
            Q(zones_couvertes__icontains=q)
        )

    if statut:
        qs = qs.filter(statut=statut)

    if dispo in ("1", "0"):
        qs = qs.filter(disponible=(dispo == "1"))

    items = qs.order_by("-created_at")

    return render(request, "admin/staff/list.html", {
        "items": items,
        "q": q,
        "statut": statut,
        "dispo": dispo,
        "statuts": FemmeMenage.STATUT_CHOICES,
    })


@login_required
def detail_view(request, pk):
    """
    Admin > Femme de ménage : détail + historique RDV
    """
    femme = get_object_or_404(FemmeMenage, pk=pk)
    rdv_list = RendezVous.objects.filter(femme=femme).select_related("demande", "service").order_by("-date_heure")[:20]

    return render(request, "admin/staff/detail.html", {
        "femme": femme,
        "rdv_list": rdv_list,
    })


@login_required
def create_view(request):
    """
    Admin > Ajouter femme de ménage
    """
    if request.method == "POST":
        form = FemmeMenageForm(request.POST, request.FILES)
        if form.is_valid():
            femme = form.save()
            messages.success(request, "Femme de ménage ajoutée ✅")
            return redirect("staff:detail", pk=femme.pk)
    else:
        form = FemmeMenageForm()

    return render(request, "admin/staff/create.html", {"form": form})


@login_required
def edit_view(request, pk):
    """
    Admin > Modifier femme de ménage
    """
    femme = get_object_or_404(FemmeMenage, pk=pk)

    if request.method == "POST":
        form = FemmeMenageForm(request.POST, request.FILES, instance=femme)
        if form.is_valid():
            form.save()
            messages.success(request, "Modifié ✅")
            return redirect("staff:detail", pk=femme.pk)
    else:
        form = FemmeMenageForm(instance=femme)

    return render(request, "admin/staff/edit.html", {"form": form, "femme": femme})


@login_required
def toggle_active(request, pk):
    """
    Toggle Active/Inactive + disponible
    """
    femme = get_object_or_404(FemmeMenage, pk=pk)
    if request.method == "POST":
        if femme.statut == "ACTIVE":
            femme.statut = "INACTIVE"
            femme.disponible = False
        else:
            femme.statut = "ACTIVE"
            femme.disponible = True
        femme.save(update_fields=["statut", "disponible"])
        messages.success(request, "Statut mis à jour ✅")

    return redirect("staff:detail", pk=femme.pk)


@login_required
@require_POST
def staff_delete(request, pk):
    femme = get_object_or_404(FemmeMenage, pk=pk)
    femme.delete()
    messages.success(request, "Femme de ménage supprimée avec succès.")
    return redirect("staff:list")


