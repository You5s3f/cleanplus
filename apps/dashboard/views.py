from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from apps.demandes.models import DemandeDevis
from apps.rdv.models import RendezVous
from apps.staff.models import FemmeMenage

@login_required
def index(request):
    kpi = {
        "demandes_total": DemandeDevis.objects.count(),
        "demandes_nouvelles": DemandeDevis.objects.filter(statut="NOUVELLE").count(),
        "rdv_total": RendezVous.objects.count(),
        "staff_actives": FemmeMenage.objects.filter(statut="ACTIVE").count(),
    }
    last_demandes = DemandeDevis.objects.all()[:6]
    next_rdv = RendezVous.objects.order_by("date_heure")[:6]
    return render(request, "admin/dashboard/index.html", {
        "kpi": kpi,
        "last_demandes": last_demandes,
        "next_rdv": next_rdv,
    })
