from django.urls import path
from . import views

app_name = "rdv"

urlpatterns = [
    path("", views.list_view, name="list"),
    path("create/", views.create_view, name="create"),
    path("<int:pk>/", views.detail_view, name="detail"),
    path("calendar/", views.calendar_view, name="calendar"),
    # ✅ Create RDV from a Demande
    path("from-demande/<int:demande_id>/", views.create_from_demande, name="create_from_demande"),
    
    path("day/", views.day_view, name="day"),
    path("dashboard/", views.dashboard_view, name="dashboard"),
    
         path("<int:pk>/update/", views.update_view, name="update"),
    path("<int:pk>/cancel/", views.cancel_view, name="cancel"),
]
