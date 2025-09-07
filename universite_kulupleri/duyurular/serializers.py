from rest_framework import serializers
from .models import Duyuru

class DuyuruSerializer(serializers.ModelSerializer):
    kulup_adi = serializers.CharField(source="kulup.ad", read_only=True)

    class Meta:
        model = Duyuru
        fields = ["id", "baslik", "icerik", "yayin_tarihi", "kulup", "kulup_adi"]
