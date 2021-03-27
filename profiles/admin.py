from django.contrib import admin
from profiles.models import *


class OrganizationAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Name', {'fields': ['name']})
    ]
    list_display = [
        'name'
    ]
    list_filter = [
        'name'
    ]


class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'subscribe_date'
    ]


class ConsumerAdmin(admin.ModelAdmin):
    list_display = [
        'profile', 'experience'
    ]


class AnalystAdmin(admin.ModelAdmin):
    list_display = [
        'profile', 'organization'
    ]
    list_filter = [
        'organization'
    ]


# Register your models here.
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Analyst, AnalystAdmin)
admin.site.register(Consumer, ConsumerAdmin)
admin.site.register(Organization, OrganizationAdmin)
