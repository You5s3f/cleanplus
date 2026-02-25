from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib import messages

from .models import Service
from .forms import ServiceForm
from django.shortcuts import get_object_or_404

@login_required
def list_view(request):
    items = Service.objects.all()
    return render(request, "admin/services/list.html", {"items": items})

@login_required
def create_view(request):
    if request.method == "POST":
        form = ServiceForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Créé avec succès.")
            return redirect("services:list")
    else:
        form = ServiceForm()
    return render(request, "admin/services/create.html", {"form": form})
login_required
def edit_view(request, id):
    service = get_object_or_404(Service, id=id)

    if request.method == "POST":
        form = ServiceForm(request.POST, request.FILES, instance=service)
        if form.is_valid():
            form.save()
            messages.success(request, "Service modifié avec succès.")
            return redirect("services:list")
    else:
        form = ServiceForm(instance=service)

    return render(request, "admin/services/edit.html", {
        "form": form,
        "service": service
    })


@login_required
def delete_view(request, id):
    service = get_object_or_404(Service, id=id)

    if request.method == "POST":
        service.delete()
        messages.success(request, "Service supprimé avec succès.")
        return redirect("services:list")

    # Sécurité : si quelqu’un tente en GET
    return redirect("services:list")