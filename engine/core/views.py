from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido
from .serializers import PedidoSerializer

# Create your views here.
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
