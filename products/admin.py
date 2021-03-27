from django.contrib import admin
from products.models import *


class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    search_fields = [
        'name'
    ]


class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name'
    ]
    search_fields = [
        'name'
    ]


class StoreAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Name', {'fields': ['name']}),
        ('Store on the map', {'fields': ['pnt']}),
        ('Picture', {'fields': ['picture']})
    ]
    list_display = [
        'name', 'pnt'
    ]
    search_fields = [
        'name'
    ]


# Register your models here.
admin.site.register(Product, ProductAdmin)
admin.site.register(Store, StoreAdmin)
admin.site.register(Category, CategoryAdmin)
