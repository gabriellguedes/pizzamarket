from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido, Produto
from .serializers import PedidoSerializer, ProdutoSerializer

# Create your views here.
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer