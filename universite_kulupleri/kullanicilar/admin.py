# universite_kulupleri/kullanicilar/admin.py
from django.contrib import admin
from .models import Uyelik

@admin.register(Uyelik)
class UyelikAdmin(admin.ModelAdmin):
    list_display = ("user", "kulup", "joined_at")
    search_fields = ("user__username", "user__email", "kulup__ad")
