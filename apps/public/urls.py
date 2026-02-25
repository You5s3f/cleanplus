from django.urls import path
from . import views

app_name = "public"

urlpatterns = [
    path("", views.home, name="home"),
    path("services/", views.services_page, name="services"),
    path("devis/", views.devis, name="devis"),
    path("devis/success/", views.devis_success, name="devis_success"),
   
    
    path("about/", views.about, name="about"),
    
]
