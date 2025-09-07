from rest_framework import serializers
from .models import Etkinlik

class EtkinlikSerializer(serializers.ModelSerializer):
    kulup_adi = serializers.CharField(source="kulup.ad", read_only=True)

    class Meta:
        model = Etkinlik
        fields = ["id", "baslik", "aciklama", "tarih", "olusturulma_tarihi", "kulup", "kulup_adi"]
