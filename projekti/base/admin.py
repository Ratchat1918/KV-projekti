from django.contrib import admin
from .models import DatePlazas
from .models import GroupMember

@admin.register(DatePlazas)
class DatePlazasAdmin(admin.ModelAdmin):
    list_display = ('date', 'plazas')
    search_fields = ('date',)


admin.site.register(GroupMember)