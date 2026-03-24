from rest_framework import serializers
from .models import Categoria, Produto, Pedido, ItemPedido
from django.db import transaction
from .payments import gerar_pagamento_pix # Importe sua função de pagamento

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

class ProdutoSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')

    class Meta:
        model = Produto
        fields = ['id', 'nome', 'descricao', 'preco', 'imagem', 'disponivel', 'categoria', 'categoria_nome']

class ItemPedidoSerializer(serializers.ModelSerializer):
    nome_produto = serializers.ReadOnlyField(source='produto.nome')

    class Meta:
        model = ItemPedido
        fields = ['produto', 'nome_produto', 'quantidade', 'preco_unitario']
        read_only_fields = ['preco_unitario'] 

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)
    
    # Usamos CharField com read_only para que o Serializer aceite 
    # as propriedades que vamos "injetar" no objeto pedido manualmente
    pix_copia_e_cola = serializers.CharField(read_only=True, required=False, allow_blank=True)
    pix_qr_64 = serializers.CharField(read_only=True, required=False, allow_blank=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente_nome', 'whatsapp', 'endereco', 'total', 
            'status_pagamento', 'itens', 'pix_copia_e_cola', 'pix_qr_64'
        ]

    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        
        # 1. Cria o pedido dentro de uma transação para segurança
        with transaction.atomic():
            pedido = Pedido.objects.create(**validated_data)
            
            total_pedido = 0
            for item in itens_data:
                produto = item['produto']
                quantidade = item['quantidade']
                preco = produto.preco
                
                ItemPedido.objects.create(
                    pedido=pedido,
                    produto=produto,
                    quantidade=quantidade,
                    preco_unitario=preco
                )
                total_pedido += preco * quantidade
            
            pedido.total = total_pedido
            pedido.save()

        # 2. GERAÇÃO DO PIX (A mágica acontece aqui)
        try:
            dados_pix = gerar_pagamento_pix(pedido)
            
            # Anexamos os dados de resposta do Mercado Pago ao objeto 'pedido'
            # O Serializer vai ler essas propriedades agora que elas existem no objeto
            pedido.pix_copia_e_cola = dados_pix['qr_code']
            pedido.pix_qr_64 = dados_pix['qr_code_base64']
            
            # Salva o ID do pagamento para usarmos no Webhook depois
            pedido.pagamento_id = dados_pix['id']
            pedido.save()
            
        except Exception as e:
            print(f"--- ERRO AO GERAR PIX NO MERCADO PAGO ---")
            print(f"Detalhe: {e}")
            # Se falhar, enviamos campos vazios para não travar o JSON
            pedido.pix_copia_e_cola = ""
            pedido.pix_qr_64 = ""

        return pedido