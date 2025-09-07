from rest_framework import viewsets
from .models import Etkinlik
from .serializers import EtkinlikSerializer

class EtkinlikViewSet(viewsets.ModelViewSet):
    queryset = Etkinlik.objects.all().order_by("tarih")
    serializer_class = EtkinlikSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        kulup_id = self.request.query_params.get("kulup")
        if kulup_id:
            queryset = queryset.filter(kulup_id=kulup_id)
        return queryset
