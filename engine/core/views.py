from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Pedido, Produto
from .serializers import PedidoSerializer, ProdutoSerializer
import mercadopago
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


# Create your views here.
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

@api_view(['PATCH'])
def finalizar_pedido(request, pk):
    try:
        pedido = Pedido.objects.get(pk=pk)
        pedido.status_pagamento = 'finalizado'
        pedido.save()
        return Response({"message": "Pedido finalizado!"}, status=200)
    except Pedido.DoesNotExist:
        return Response({"error": "Pedido não encontrado"}, status=404)

@csrf_exempt
def webhook_mercadopago(request):
    payment_id = None
    topic = None

    # 1. Tenta pegar o ID se vier via JSON (POST Body)
    if request.method == 'POST':
        try:
            body_data = json.loads(request.body)
            # O MP costuma enviar como {'data': {'id': '123'}, 'type': 'payment'}
            payment_id = body_data.get('data', {}).get('id')
            topic = body_data.get('type')
        except json.JSONDecodeError:
            pass

    # 2. Se não achou no Body, tenta pegar via URL (?data.id=123&type=payment)
    if not payment_id:
        payment_id = request.GET.get('data.id')
        topic = request.GET.get('type')

    print(f"--- WEBHOOK RECEBIDO --- ID: {payment_id} | Tópico: {topic}")

    if topic == 'payment' and payment_id:
        sdk = mercadopago.SDK(settings.MERCADOPAGO_TOKEN)
        
        # Consultamos o status real no Mercado Pago
        payment_info = sdk.payment().get(payment_id)
        
        if payment_info["status"] == 200:
            payment_data = payment_info["response"]
            status = payment_data.get("status")
            
            print(f"Status do pagamento {payment_id} no MP: {status}")

            if status == 'approved':
                try:
                    # Buscamos o pedido pelo pagamento_id
                    pedido = Pedido.objects.get(pagamento_id=str(payment_id))
                    if pedido.status_pagamento != 'pago':
                        pedido.status_pagamento = 'pago'
                        pedido.save()
                        print(f"✅ SUCESSO: Pedido {pedido.id} marcado como PAGO!")
                except Pedido.DoesNotExist:
                    print(f"⚠️ AVISO: Pagamento {payment_id} aprovado, mas não achei no banco.")
        else:
            print(f"❌ Erro ao consultar pagamento {payment_id} no Mercado Pago.")

    return HttpResponse(status=200)