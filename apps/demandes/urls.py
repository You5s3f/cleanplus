from django.urls import path
from . import views

app_name = "demandes"

urlpatterns = [
    path("", views.list_view, name="list"),
    path("create/", views.create_view, name="create"),
    
    path("<int:pk>/", views.detail_view, name="detail"),
    path("<int:pk>/status/", views.update_status, name="update_status"),
    path("<int:pk>/delete/", views.demandes_delete, name="delete"),
]
