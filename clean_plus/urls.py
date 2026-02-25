from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.static import static
urlpatterns = [
    path("django-admin/", admin.site.urls),
    
    path("", include("apps.public.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("admin/dashboard/", include("apps.dashboard.urls")),
    path("admin/services/", include("apps.services.urls")),
    path("admin/demandes/", include("apps.demandes.urls")),
    path("admin/rdv/", include("apps.rdv.urls")),
    path("admin/staff/", include("apps.staff.urls")),
    
    path("", include("apps.contact.urls")),  # AVANT
    path("", include("apps.public.urls")),   # APRÈS
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)