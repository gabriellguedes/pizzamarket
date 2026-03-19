from rest_framework import serializers
from .models import Pedido, ItemPedido, Produto
from django.db import transaction # Para garantir que se algo der errado, nada seja salvo

class ItemPedidoSerializer(serializers.ModelSerializer):
    nome_produto = serializers.ReadOnlyField(source='produto.nome')

    class Meta:
        model = ItemPedido
        fields = ['produto', 'nome_produto', 'quantidade', 'preco_unitario']
        # preco_unitario será preenchido pelo backend, então tiramos da obrigatoriedade do post
        extra_kwargs = {'preco_unitario': {'read_only': True}}

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente_nome', 'whatsapp', 'endereco', 'total', 'status_pagamento', 'itens']
        read_only_fields = ['total', 'status_pagamento'] # O cliente não define isso

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        
        # Usamos uma transação atômica: ou salva tudo, ou nada (evita pedidos sem itens)
        with transaction.atomic():
            pedido = Pedido.objects.create(**validated_data)
            total_geral = 0
            
            for item in itens_data:
                produto = item['produto'] # O DRF já converte o ID para o objeto Produto
                quantidade = item['quantidade']
                preco_no_momento = produto.preco
                
                ItemPedido.objects.create(
                    pedido=pedido,
                    produto=produto,
                    quantidade=quantidade,
                    preco_unitario=preco_no_momento
                )
                
                total_geral += preco_no_momento * quantidade
            
            # Atualiza o total do pedido com o cálculo feito no servidor
            pedido.total = total_geral
            pedido.save()
            
        return pedido
