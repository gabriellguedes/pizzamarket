from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Este método é chamado logo após o login social ser bem-sucedido, 
        mas antes do usuário ser logado no sistema.
        """
        user = sociallogin.user
        # Se for um novo usuário, o ID será None
        if not user.id:
            # Aqui você pode pré-preencher campos se o provedor enviar
            # O Google não envia CPF, então o campo ficará nulo inicialmente
            pass

    def save_user(self, request, sociallogin, form=None):
        """
        Garante que o usuário social seja salvo corretamente com o nosso modelo.
        """
        user = super().save_user(request, sociallogin, form)
        return user