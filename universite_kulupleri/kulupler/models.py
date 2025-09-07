from django.db import models
from django.contrib.auth.models import User

class Kulup(models.Model):
    ad = models.CharField(max_length=100)
    kategori = models.CharField(max_length=50)  # Spor, Sanat, Teknoloji vb.
    aciklama = models.TextField()
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    yonetici = models.ForeignKey(User, on_delete=models.CASCADE, related_name="yonettigi_kulupler")

    def __str__(self):
        return self.ad
    
