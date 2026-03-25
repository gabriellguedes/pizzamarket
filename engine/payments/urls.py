from django.urls import path
from .views import mercadopago_webhook

urlpatterns = [
    path('webhook/mercadopago/', mercadopago_webhook, name='mp_webhook'),
]