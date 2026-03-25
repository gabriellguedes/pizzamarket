from django.db import models
from engine.orders.models import Pedido

class TransacaoPagamento(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='transacoes')
    pagamento_id_externo = models.CharField(max_length=255, unique=True)
    status_mp = models.CharField(max_length=50)
    metodo_pagamento = models.CharField(max_length=50, null=True, blank=True)
    payload_raw = models.TextField() # Guarda o JSON bruto para segurança
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido {self.pedido.id} - {self.status_mp}"