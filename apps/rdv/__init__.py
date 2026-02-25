def save(self, *args, **kwargs):
    """
    Auto disponibilité:
    - Si RDV actif (PLANIFIE/EN_COURS) + femme => femme.disponible=False
    - Si RDV fini (TERMINE/ANNULE) => femme.disponible=True si aucun autre RDV actif
    - Si la femme change, on libère l'ancienne si possible
    """
    BUSY_STATUSES = {"PLANIFIE", "EN_COURS"}
    FREE_STATUSES = {"TERMINE", "ANNULE"}

    old = None
    if self.pk:
        try:
            old = type(self).objects.get(pk=self.pk)
        except type(self).DoesNotExist:
            old = None

    super().save(*args, **kwargs)

    # --- helper interne ---
    def refresh(femme):
        if not femme:
            return
        has_busy = type(self).objects.filter(
            femme=femme,
            statut__in=BUSY_STATUSES
        ).exclude(pk=self.pk).exists()

        # Si le RDV courant est busy et sur cette femme => busy aussi
        if self.femme_id == femme.id and self.statut in BUSY_STATUSES:
            has_busy = True

        femme.disponible = not has_busy
        femme.save(update_fields=["disponible"])

    # 1) Si femme a changé => refresh ancienne
    if old and old.femme_id and old.femme_id != self.femme_id:
        refresh(old.femme)

    # 2) Refresh femme actuelle selon statut
    if self.femme_id:
        refresh(self.femme)
