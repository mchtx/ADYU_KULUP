# universite_kulupleri/kullanicilar/models.py
from django.db import models
from django.contrib.auth.models import User
from kulupler.models import Kulup

class Uyelik(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uyelikler")
    kulup = models.ForeignKey(Kulup, on_delete=models.CASCADE, related_name="uyeler")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "kulup")
        indexes = [
            models.Index(fields=["user", "kulup"]),
        ]

    def __str__(self):
        return f"{self.user.username} -> {self.kulup.ad}"
