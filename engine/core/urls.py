from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PedidoViewSet # Certifique-se de que a View já existe

router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
