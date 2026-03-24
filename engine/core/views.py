from django.shortcuts import render
from rest_framework import viewsets
from .models import Pedido, Produto
from .serializers import PedidoSerializer, ProdutoSerializer
import mercadopago
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import Pedido


# Create your views here.
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

@csrf_exempt
def webhook_mercadopago(request):
    # 1. O Mercado Pago envia o ID do recurso via query params ou body
    payment_id = request.GET.get('data.id') or request.POST.get('data.id')
    topic = request.GET.get('type') or request.POST.get('type')

    # Só nos interessa se o tópico for 'payment'
    if topic == 'payment' and payment_id:
        sdk = mercadopago.SDK(settings.MERCADOPAGO_TOKEN)
        
        # 2. Consultamos o Mercado Pago para confirmar o status real
        payment_info = sdk.payment().get(payment_id)
        status = payment_info["response"].get("status")
        external_reference = payment_info["response"].get("external_reference") 
        # (Dica: Você pode passar o ID do pedido no external_reference ao criar o pix)

        if status == 'approved':
            # 3. Buscamos o pedido no nosso banco usando o pagamento_id que salvamos
            try:
                pedido = Pedido.objects.get(pagamento_id=payment_id)
                pedido.status_pagamento = 'pago'
                pedido.status_producao = 'preparando' # Já manda pra cozinha!
                pedido.save()
                print(f"Pedido {pedido.id} aprovado com sucesso!")
            except Pedido.DoesNotExist:
                pass

    return HttpResponse(status=200) # Sempre responda 200 para o Mercado Pago