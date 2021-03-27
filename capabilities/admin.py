from django.contrib import admin
from capabilities.models import *


class ReportAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Product', {'fields': ['product']}),
        ('Price (€)', {'fields': ['price']}),
        ('User', {'fields': ['consumer']}),
        ('Picture', {'fields': ['picture']}),
        ('Location', {'fields': ['store', 'pnt']}),
        ('created_time', {'fields': ['created_time'], 'classes': ['collapse']}),
    ]
    list_display = [
        'pk', '__str__', 'pnt', 'store'
    ]
    list_filter = [
        'consumer', 'store', 'created_time'
    ]
    search_fields = [
        'product'
    ]


class DumpAdmin(admin.ModelAdmin):
    list_display = [
        'pk', '__str__'
    ]
    list_filter = [
        'search__profile__user', 'export_format', 'download_timestamp'
    ]


class SearchAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Product', {'fields': ['product_query', 'categories']}),
        ('Profile', {'fields': ['profile']}),
        ('Price', {'fields': ['price_max', 'price_min']}),
        ('After date', {'fields': ['after_date']}),
        ('Geographic query', {'fields': ['distance', 'pnt']}),
        ('Order By', {'fields': ['ordering_by']}),
        ('Is starred', {'fields': ['is_starred'], 'classes': ['collapse']}),
        ('created_time', {'fields': ['created_time'], 'classes': ['collapse']}),
    ]
    list_display = [
        'pk', 'profile', 'price_min', 'price_max', 'created_time', 'distance', 'pnt'
    ]
    list_filter = [
        'profile', 'created_time', 'created_time', 'pnt'
    ]
    search_fields = [
        'product_query'
    ]


admin.site.register(Dump, DumpAdmin)
admin.site.register(Search, SearchAdmin)
admin.site.register(Report, ReportAdmin)
