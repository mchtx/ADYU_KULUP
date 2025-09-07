from django.contrib import admin
from .models import Kulup

@admin.register(Kulup)
class KulupAdmin(admin.ModelAdmin):
    list_display = ("ad", "kategori", "yonetici", "olusturulma_tarihi")
    search_fields = ("ad", "kategori")
    list_filter = ("kategori",)
