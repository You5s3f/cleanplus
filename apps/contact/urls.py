# apps/contact/urls.py
from django.urls import path
from . import views

app_name = "contact"
name="contact"

urlpatterns = [
    path("contact/", views.contact_view, name="contact"),
    path("admin/messages/", views.admin_message_list, name="admin_list"),
    path("admin/messages/<int:pk>/", views.admin_message_detail, name="admin_detail"),
]
