# universite_kulupleri/kullanicilar/views.py
from django.contrib.auth.models import User
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer, UyelikSerializer
from .models import Uyelik
from kulupler.models import Kulup

class KullaniciViewSet(viewsets.GenericViewSet):
    """
    /api/kullanicilar/register/  [POST] -> hesap oluştur
    /api/kullanicilar/me/        [GET]  -> profil getir
    /api/kullanicilar/me/        [PATCH]-> profil güncelle (ad/soyad/email)
    /api/kullanicilar/me/kulupler/ [GET] -> kullanıcının üyelikleri
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "register":
            return RegisterSerializer
        return UserSerializer

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        if request.method.lower() == "get":
            return Response(UserSerializer(request.user).data)
        # PATCH
        ser = UserSerializer(request.user, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

    @action(detail=False, methods=["get"], url_path="me/kulupler")
    def me_kulupler(self, request):
        uyelikler = Uyelik.objects.select_related("kulup").filter(user=request.user).order_by("-joined_at")
        return Response(UyelikSerializer(uyelikler, many=True).data)

class UyelikViewSet(mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    """
    /api/uyelikler/           [POST]  -> { "kulup": <id> } kulübe katıl
    /api/uyelikler/{id}/      [DELETE]-> üyelikten ayrıl (üyelik id ile)
    /api/uyelikler/leave/{kulup_id}/ [DELETE] -> kulüp id ile ayrıl (kolaylık)
    """
    serializer_class = UyelikSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Uyelik.objects.filter(user=self.request.user).select_related("kulup")

    def perform_create(self, serializer):
        kulup = serializer.validated_data["kulup"]
        serializer.save(user=self.request.user, kulup=kulup)

    @action(detail=False, methods=["delete"], url_path="leave/(?P<kulup_id>[^/.]+)")
    def leave_by_kulup(self, request, kulup_id=None):
        try:
            uyelik = Uyelik.objects.get(user=request.user, kulup_id=kulup_id)
        except Uyelik.DoesNotExist:
            return Response({"detail": "Bu kulüpte üyeliğin yok."}, status=404)
        uyelik.delete()
        return Response({"detail": "Kulüpten ayrıldın."}, status=200)
