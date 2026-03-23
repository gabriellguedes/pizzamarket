from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, PedidoViewSet # Importe suas views

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'pedidos', PedidoViewSet, basename='pedido')

urlpatterns = [
    path('', include(router.urls)),
]