from rest_framework import viewsets, permissions
from .models import Pedido
from .serializers import PedidoSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-criado_em')
    serializer_class = PedidoSerializer
    # Por enquanto permitimos qualquer um, depois restringimos para o dono ver só os dele
    permission_classes = [permissions.AllowAny]