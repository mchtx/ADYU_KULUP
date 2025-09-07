from rest_framework import serializers
from .models import Kulup

class KulupSerializer(serializers.ModelSerializer):
    yonetici_adi = serializers.CharField(source="yonetici.username", read_only=True)

    class Meta:
        model = Kulup
        fields = ["id", "ad", "kategori", "aciklama", "olusturulma_tarihi", "yonetici_adi"]
