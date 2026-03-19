from django.db import models

class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Produto(models.Model):
    categoria = models.ForeignKey(Categoria, related_name='produtos', on_delete=models.CASCADE)
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True)
    preco = models.DecimalField(max_digits=7, decimal_places=2)
    imagem = models.ImageField(upload_to='produtos/', null=True, blank=True)
    disponivel = models.BooleanField(default=True)

    def __str__(self):
        return self.nome

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

    cliente_nome = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=20)
    endereco = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Controle de Status
    status_pagamento = models.CharField(max_length=20, choices=STATUS_PAGAMENTO, default='pendente')
    status_producao = models.CharField(max_length=20, choices=STATUS_PRODUCAO, default='recebido')

    # ID de transação para o Mercado Pago / Stripe
    pagamento_id = models.CharField(max_length=255, null=True, blank=True)

    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido {self.id} - {self.cliente_nome}"

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)
    preco_unitario = models.DecimalField(max_digits=7, decimal_places=2) # Salva o preço do momento da compra

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome}"
