from rest_framework import serializers
from .models import Pedido, ItemPedido, Produto

class ItemPedidoSerializer(serializers.ModelSerializer):
    # Usamos ReadOnly para o nome, apenas para facilitar a exibição no front
    nome_produto = serializers.ReadOnlyField(source='produto.nome')

    class Meta:
        model = ItemPedido
        fields = ['produto', 'nome_produto', 'quantidade', 'preco_unitario']

class PedidoSerializer(serializers.ModelSerializer):
    # O related_name='itens' que definimos no Model aparece aqui
    itens = ItemPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente_nome', 'whatsapp', 'endereco', 
            'total', 'status_pagamento', 'itens', 'pagamento_id'
        ]

    def create(self, validated_data):
        # Removemos os itens dos dados validados para criar o Pedido primeiro
        itens_data = validated_data.pop('itens')
        pedido = Pedido.objects.create(**validated_data)
        
        # Agora criamos cada item vinculado a este pedido
        for item in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item)
            
        return pedido
