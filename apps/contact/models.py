from django.db import models


class ContactMessage(models.Model):
    SUBJECT_QUOTE = "quote"
    SUBJECT_INFO = "info"
    SUBJECT_EXISTING = "existing"
    SUBJECT_COMPLAINT = "complaint"
    SUBJECT_OTHER = "other"

    SUBJECT_CHOICES = [
        (SUBJECT_QUOTE, "Demande de devis"),
        (SUBJECT_INFO, "Demande d'information"),
        (SUBJECT_EXISTING, "Client existant"),
        (SUBJECT_COMPLAINT, "Réclamation"),
        (SUBJECT_OTHER, "Autre"),
    ]

    # Infos client
    name = models.CharField(
        max_length=150,
        verbose_name="Nom complet"
    )
    email = models.EmailField(
        verbose_name="Email"
    )
    phone = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Téléphone"
    )

    # Contenu du message
    subject = models.CharField(
        max_length=20,
        choices=SUBJECT_CHOICES,
        verbose_name="Sujet"
    )
    message = models.TextField(
        verbose_name="Message"
    )

    # Suivi admin
    is_read = models.BooleanField(
        default=False,
        verbose_name="Lu"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'envoi"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self):
        return f"{self.name} – {self.get_subject_display()}"
