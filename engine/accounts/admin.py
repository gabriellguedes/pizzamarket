from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    # Adiciona os campos novos ao formulário do admin
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('cpf', 'telefone', 'pontos_fidelidade')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('cpf', 'telefone')}),
    )
    list_display = ['email', 'username', 'cpf', 'is_staff']

admin.site.register(User, CustomUserAdmin)