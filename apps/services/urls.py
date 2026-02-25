from django.urls import path
from . import views

app_name = "services"

urlpatterns = [
    path("", views.list_view, name="list"),
    path("create/", views.create_view, name="create"),
    path("<int:id>/edit/", views.edit_view, name="edit"),
    path("<int:id>/delete/", views.delete_view, name="delete"),
]
