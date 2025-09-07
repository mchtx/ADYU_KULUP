from django.contrib import admin
from .models import Etkinlik

@admin.register(Etkinlik)
class EtkinlikAdmin(admin.ModelAdmin):
    list_display = ("baslik", "kulup", "tarih")
    list_filter = ("kulup",)
    search_fields = ("baslik", "aciklama")
