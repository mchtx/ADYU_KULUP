from django.db import models
from kulupler.models import Kulup

class Duyuru(models.Model):
    kulup = models.ForeignKey(Kulup, on_delete=models.CASCADE, related_name="duyurular")
    baslik = models.CharField(max_length=150)
    icerik = models.TextField()
    yayin_tarihi = models.DateTimeField(auto_now_add=True, null=True, blank=True)


    def __str__(self):
        return f"{self.baslik} ({self.kulup.ad})"
