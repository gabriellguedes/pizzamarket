from django.db import models
from django.conf import settings
from engine.products.models import Produto # Vamos criar este em seguida

class Pedido(models.Model):
    STATUS_PAGAMENTO = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('cancelado', 'Cancelado'),
    ]

    STATUS_PRODUCAO = [
        ('recebido', 'Pedido Recebido'),
        ('preparando', 'Na Cozinha'),
        ('entrega', 'Saiu para Entrega'),
        ('concluido', 'Entregue'),
    ]

    # Vinculando ao usuário (accounts.User)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='pedidos'
    )
    
    # Dados de entrega (podem ser diferentes do cadastro do usuário)
    cliente_nome = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=20)
    endereco = models.TextField()
    
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status_pagamento = models.CharField(max_length=20, choices=STATUS_PAGAMENTO, default='pendente')
    status_producao = models.CharField(max_length=20, choices=STATUS_PRODUCAO, default='recebido')
    
    pagamento_id = models.CharField(max_length=255, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido {self.id} - {self.cliente_nome}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    
    # Sabor 1 (Obrigatório)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='itens_base')
    
    # Sabor 2 (Opcional - para Meio a Meio)
    segundo_sabor = models.ForeignKey(
        Produto, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='itens_meio_a_meio'
    )
    
    # Observações (Ex: "Sem cebola", "Borda recheada")
    observacoes = models.TextField(blank=True, null=True)
    
    quantidade = models.PositiveIntegerField(default=1)
    preco_unitario = models.DecimalField(max_digits=7, decimal_places=2)

    def __str__(self):
        nome = self.produto.nome
        if self.segundo_sabor:
            nome = f"1/2 {self.produto.nome} + 1/2 {self.segundo_sabor.nome}"
        return f"{self.quantidade}x {nome}"