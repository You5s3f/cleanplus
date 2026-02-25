from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404, redirect
from django.contrib import messages
from datetime import timedelta, time
from django.utils import timezone

from django.db.models import Q
from .models import RendezVous
from .forms import RendezVousForm
from apps.demandes.models import DemandeDevis
from django.utils import timezone
from django.db.models import Count

from apps.demandes.models import DemandeDevis
from apps.staff.models import FemmeMenage

@login_required
def list_view(request):
    """
    Admin > RDV : liste simple
    """
    items = RendezVous.objects.select_related("demande", "service", "femme").order_by("-date_heure")
    services = sorted({str(r.service) for r in items if r.service})
    femmes = sorted({str(r.femme) for r in items if r.femme})
    

    return render(request, "admin/rdv/list.html", {
        "items": items,
        "services": services,
        "femmes": femmes,
    })


@login_required
def detail_view(request, pk):
    """
    Admin > RDV : détail
    """
    rdv = get_object_or_404(RendezVous, pk=pk)
    return render(request, "admin/rdv/detail.html", {"rdv": rdv})


@login_required
def update_view(request, pk):
    """
    Admin > RDV : modifier
    """
    rdv = get_object_or_404(RendezVous, pk=pk)

    # Option sécurité : empêcher modification si annulé
    if rdv.statut == "ANNULE":
        messages.error(request, "Impossible de modifier un RDV annulé.")
        return redirect("rdv:detail", pk=rdv.pk)

    if request.method == "POST":
        form = RendezVousForm(request.POST, instance=rdv)
        if form.is_valid():
            form.save()
            messages.success(request, "Rendez-vous modifié avec succès ✅")
            return redirect("rdv:detail", pk=rdv.pk)
    else:
        form = RendezVousForm(instance=rdv)

    return render(request, "admin/rdv/update.html", {
        "form": form,
        "rdv": rdv,
    })

@login_required
def cancel_view(request, pk):
    """
    Admin > RDV : annuler (changement de statut)
    """
    rdv = get_object_or_404(RendezVous, pk=pk)

    if rdv.statut == "ANNULE":
        messages.info(request, "Ce rendez-vous est déjà annulé.")
        return redirect("rdv:detail", pk=rdv.pk)

    if request.method == "POST":
        rdv.statut = "ANNULE"
        rdv.femme = None  # optionnel mais recommandé
        rdv.save(update_fields=["statut", "femme"])
        messages.warning(request, "Rendez-vous annulé ❌")
        return redirect("rdv:detail", pk=rdv.pk)

    return render(request, "admin/rdv/confirm_cancel.html", {
        "rdv": rdv
    })







@login_required
def create_view(request):
    """
    Admin > Créer RDV (manuel)
    """
    if request.method == "POST":
        form = RendezVousForm(request.POST)
        if form.is_valid():
            rdv = form.save()
            messages.success(request, "Rendez-vous créé ✅")
            return redirect("rdv:detail", pk=rdv.pk)
    else:
        form = RendezVousForm()

    return render(request, "admin/rdv/create.html", {"form": form})


@login_required
def create_from_demande(request, demande_id):
    """
    ✅ Créer RDV à partir d'une Demande (pré-rempli):
    - demande + service + adresse préremplis
    - admin choisit date/heure, durée, femme, statut
    """
    demande = get_object_or_404(DemandeDevis, pk=demande_id)

    if request.method == "POST":
        form = RendezVousForm(request.POST)
        if form.is_valid():
            rdv = form.save(commit=False)
            rdv.demande = demande
            # si service vide dans POST, on force service = demande.service
            if not rdv.service:
                rdv.service = demande.service
            # si adresse vide, on force
            if not rdv.adresse:
                rdv.adresse = demande.adresse
            rdv.save()
            messages.success(request, "RDV créé à partir de la demande ✅")
            return redirect("rdv:detail", pk=rdv.pk)
    else:
        # Pré-remplissage
        form = RendezVousForm(initial={
            "demande": demande,
            "service": demande.service,
            "adresse": demande.adresse,
            "statut": "PLANIFIE",
            "duree_minutes": 120,
        })

    return render(request, "admin/rdv/create_from_demande.html", {
        "form": form,
        "demande": demande,
    })

@login_required
def calendar_view(request):
    """
    Admin > RDV > Calendrier (vue semaine)
    - Paramètres GET:
      - week=YYYY-MM-DD  (date dans la semaine)
    """
    # date de référence
    week_str = request.GET.get("week")
    if week_str:
        try:
            ref_date = timezone.datetime.fromisoformat(week_str).date()
        except ValueError:
            ref_date = timezone.localdate()
    else:
        ref_date = timezone.localdate()

    # start week = lundi
    start_week = ref_date - timedelta(days=ref_date.weekday())
    end_week = start_week + timedelta(days=7)

    # jours de la semaine
    days = [start_week + timedelta(days=i) for i in range(7)]

    # RDV dans la semaine (bornes datetime aware)
    start_dt = timezone.make_aware(timezone.datetime.combine(start_week, time(0, 0)))
    end_dt = timezone.make_aware(timezone.datetime.combine(end_week, time(0, 0)))

    rdv_week = RendezVous.objects.select_related("service", "femme", "demande").filter(
        date_heure__gte=start_dt,
        date_heure__lt=end_dt
    ).order_by("date_heure")

    # group par jour
    by_day = {d: [] for d in days}
    for r in rdv_week:
        d = timezone.localtime(r.date_heure).date()
        if d in by_day:
            by_day[d].append(r)

    week_columns = [{"day": d, "items": by_day[d]} for d in days]

    # navigation
    prev_week = (start_week - timedelta(days=7)).isoformat()
    next_week = (start_week + timedelta(days=7)).isoformat()

    return render(request, "admin/rdv/calendar.html", {
        "days": days,
        "by_day": by_day,
        "start_week": start_week,
        "prev_week": prev_week,
        "next_week": next_week,
        "week_columns": week_columns,
    })
    
    




@login_required
def day_view(request):
    """
    Admin > RDV > Vue Jour (timeline 08:00-20:00)
    GET:
      - date=YYYY-MM-DD
    """
    date_str = request.GET.get("date")
    if date_str:
        try:
            day = timezone.datetime.fromisoformat(date_str).date()
        except ValueError:
            day = timezone.localdate()
    else:
        day = timezone.localdate()

    # bornes journée
    start_dt = timezone.make_aware(timezone.datetime.combine(day, time(0, 0)))
    end_dt = start_dt + timedelta(days=1)

    rdvs = RendezVous.objects.select_related("service", "femme").filter(
        date_heure__gte=start_dt,
        date_heure__lt=end_dt
    ).order_by("date_heure")

    # navigation
    prev_day = (day - timedelta(days=1)).isoformat()
    next_day = (day + timedelta(days=1)).isoformat()

    # slots heures 8→20
    hours = list(range(8, 21))

    # group par heure
    by_hour = {h: [] for h in hours}
    for r in rdvs:
        h = timezone.localtime(r.date_heure).hour
        if h in by_hour:
            by_hour[h].append(r)

    timeline = [{"hour": h, "items": by_hour[h]} for h in hours]

    return render(request, "admin/rdv/day.html", {
        "day": day,
        "prev_day": prev_day,
        "next_day": next_day,
        "timeline": timeline,
    })


@login_required
def dashboard_view(request):
    """
    Admin > Dashboard (KPI)
    """
    today = timezone.localdate()
    start_week = today - timedelta(days=today.weekday())
    end_week = start_week + timedelta(days=7)

    start_dt = timezone.make_aware(timezone.datetime.combine(start_week, time(0, 0)))
    end_dt = timezone.make_aware(timezone.datetime.combine(end_week, time(0, 0)))

    # KPI Demandes
    demandes_total = DemandeDevis.objects.count()
    demandes_by_status = dict(
        DemandeDevis.objects.values("statut").annotate(c=Count("id")).values_list("statut", "c")
    )

    # KPI RDV
    rdv_total = RendezVous.objects.count()
    rdv_week = RendezVous.objects.filter(date_heure__gte=start_dt, date_heure__lt=end_dt).count()
    rdv_today = RendezVous.objects.filter(
        date_heure__gte=timezone.make_aware(timezone.datetime.combine(today, time(0, 0))),
        date_heure__lt=timezone.make_aware(timezone.datetime.combine(today + timedelta(days=1), time(0, 0))),
    ).count()

    # KPI Staff
    femmes_total = FemmeMenage.objects.count()
    femmes_dispo = FemmeMenage.objects.filter(statut="ACTIVE", disponible=True).count()
    femmes_actives = FemmeMenage.objects.filter(statut="ACTIVE").count()

    # derniers éléments
    last_demandes = DemandeDevis.objects.order_by("-created_at")[:6]
    last_rdvs = RendezVous.objects.select_related("service", "femme").order_by("-date_heure")[:6]

    return render(request, "admin/rdv/dashboard.html", {
        "today": today,
        "start_week": start_week,
        "demandes_total": demandes_total,
        "demandes_by_status": demandes_by_status,
        "rdv_total": rdv_total,
        "rdv_week": rdv_week,
        "rdv_today": rdv_today,
        "femmes_total": femmes_total,
        "femmes_actives": femmes_actives,
        "femmes_dispo": femmes_dispo,
        "last_demandes": last_demandes,
        "last_rdvs": last_rdvs,
    })


