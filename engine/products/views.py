from rest_framework import viewsets
from .models import Produto
from .serializers import ProdutoSerializer

class ProdutoViewSet(viewsets.ReadOnlyModelViewSet):
    """Viewset apenas para leitura do cardápio pelo cliente"""
    queryset = Produto.objects.filter(disponivel=True)
    serializer_class = ProdutoSerializer