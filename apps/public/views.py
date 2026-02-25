from django.shortcuts import render
from apps.services.models import Service
from apps.demandes.forms import DemandeDevisForm

def home(request):
    return render(request, "public/home.html")

def services_page(request):
    services = Service.objects.filter(actif=True).order_by("nom")
    return render(request, "public/services.html", {"services": services})

def devis(request):
    if request.method == "POST":
        form = DemandeDevisForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, "public/devis_success.html")
    else:
        form = DemandeDevisForm()
    return render(request, "public/devis.html", {"form": form})

def contact(request):
    return render(request, "public/contact.html")

def about(request):
    return render(request, "public/about.html")
from django.shortcuts import render

def devis_success(request):
    return render(request, "public/devis_success.html")
