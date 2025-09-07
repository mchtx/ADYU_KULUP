from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Kulup
from .serializers import KulupSerializer

class KulupViewSet(viewsets.ModelViewSet):
    queryset = Kulup.objects.all().order_by("-olusturulma_tarihi")
    serializer_class = KulupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Kulup.objects.all().order_by("-olusturulma_tarihi")
        kategori = self.request.query_params.get("kategori")
        if kategori:
            queryset = queryset.filter(kategori__iexact=kategori)
        return queryset
