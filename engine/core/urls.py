from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, PedidoViewSet, webhook_mercadopago, finalizar_pedido # Importe suas views

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'pedidos', PedidoViewSet, basename='pedido')

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/mercadopago/',  webhook_mercadopago, name='webhook_mercadopago'),
    path('pedidos/<int:pk>/finalizar/', finalizar_pedido, name='finalizar_pedido'),
]