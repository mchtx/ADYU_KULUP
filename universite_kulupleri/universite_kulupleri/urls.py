from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from kulupler.views import KulupViewSet
from etkinlikler.views import EtkinlikViewSet
from duyurular.views import DuyuruViewSet
from kullanicilar.views import KullaniciViewSet, UyelikViewSet

router = DefaultRouter()
router.register(r'kulupler', KulupViewSet, basename="kulupler")
router.register(r"etkinlikler", EtkinlikViewSet, basename="etkinlikler")
router.register(r"duyurular", DuyuruViewSet, basename="duyurular")
router.register(r"kullanicilar", KullaniciViewSet, basename="kullanicilar")
router.register(r"uyelikler", UyelikViewSet, basename="uyelikler")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
]
