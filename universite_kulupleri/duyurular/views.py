from rest_framework import viewsets
from .models import Duyuru
from .serializers import DuyuruSerializer

class DuyuruViewSet(viewsets.ModelViewSet):
    queryset = Duyuru.objects.all().order_by("-yayin_tarihi")
    serializer_class = DuyuruSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        kulup_id = self.request.query_params.get("kulup")
        if kulup_id:
            queryset = queryset.filter(kulup_id=kulup_id)
        return queryset
