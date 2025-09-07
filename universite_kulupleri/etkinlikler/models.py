from django.db import models
from kulupler.models import Kulup

class Etkinlik(models.Model):
    kulup = models.ForeignKey(Kulup, on_delete=models.CASCADE, related_name="etkinlikler")
    baslik = models.CharField(max_length=100)
    aciklama = models.TextField()
    tarih = models.DateTimeField()
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, null=True, blank=True)


    def __str__(self):
        return f"{self.baslik} ({self.kulup.ad})"
