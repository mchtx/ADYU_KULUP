from django.contrib import admin
from .models import Duyuru

@admin.register(Duyuru)
class DuyuruAdmin(admin.ModelAdmin):
    list_display = ("baslik", "kulup", "yayin_tarihi")
    search_fields = ("baslik", "icerik")
    list_filter = ("kulup",)
