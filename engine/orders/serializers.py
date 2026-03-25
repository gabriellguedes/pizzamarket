from rest_framework import serializers
from .models import Pedido, ItemPedido
from engine.products.serializers import ProdutoSerializer # Criaremos no app products

class ItemPedidoSerializer(serializers.ModelSerializer):
    # Mostra os detalhes dos produtos no GET, mas aceita apenas o ID no POST
    produto_detalhes = ProdutoSerializer(source='produto', read_only=True)
    segundo_sabor_detalhes = ProdutoSerializer(source='segundo_sabor', read_only=True)

    class Meta:
        model = ItemPedido
        fields = [
            'id', 'produto', 'produto_detalhes', 'segundo_sabor', 
            'segundo_sabor_detalhes', 'quantidade', 'preco_unitario', 'observacoes'
        ]

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario', 'cliente_nome', 'whatsapp', 'endereco', 
            'total', 'status_pagamento', 'status_producao', 'itens', 'criado_em'
        ]