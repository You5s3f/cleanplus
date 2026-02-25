from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .models import ContactMessage


def contact_view(request):
    if request.method == "POST":
        ContactMessage.objects.create(
            name=request.POST.get("contactName"),
            email=request.POST.get("contactEmail"),
            phone=request.POST.get("contactPhone"),
            subject=request.POST.get("contactSubject"),
            message=request.POST.get("contactMessage"),
        )
        messages.success(request, "Message envoyé avec succès.")
        return redirect("contact:contact")

    return render(request, "public/contact.html")


@login_required
def admin_message_list(request):
    messages_list = ContactMessage.objects.all()
    return render(
        request,
        "admin/contact/message_list.html",
        {"messages": messages_list},
    )


@login_required
def admin_message_detail(request, pk):
    message = get_object_or_404(ContactMessage, pk=pk)
    message.is_read = True
    message.save()

    return render(
        request,
        "admin/contact/message_detail.html",
        {"message": message},
    )
