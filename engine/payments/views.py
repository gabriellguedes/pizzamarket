import mercadopago
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from engine.orders.models import Pedido
from .models import TransacaoPagamento

@csrf_exempt
def mercadopago_webhook(request):
    if request.method == 'POST':
        sdk = mercadopago.SDK(settings.MERCADOPAGO_TOKEN)
        
        # O MP envia o ID e o tipo de notificação via query params ou body
        payment_id = request.GET.get('data.id') or request.GET.get('id')
        topic = request.GET.get('type') or request.GET.get('topic')

        if topic == 'payment' and payment_id:
            # Consulta o status real no Mercado Pago
            payment_info = sdk.payment().get(payment_id)
            if payment_info["status"] == 200:
                data = payment_info["response"]
                status = data["status"]
                # O external_reference deve ser o ID do seu Pedido enviado na criação
                pedido_id = data.get("external_reference")

                try:
                    pedido = Pedido.objects.get(id=pedido_id)
                    
                    # Atualiza o Pedido
                    if status == 'approved':
                        pedido.status_pagamento = 'pago'
                    elif status in ['cancelled', 'rejected']:
                        pedido.status_pagamento = 'cancelado'
                    
                    pedido.pagamento_id = payment_id
                    pedido.save()

                    # Registra a transação no nosso log
                    TransacaoPagamento.objects.update_or_create(
                        pagamento_id_externo=payment_id,
                        defaults={
                            'pedido': pedido,
                            'status_mp': status,
                            'payload_raw': str(data)
                        }
                    )
                except Pedido.DoesNotExist:
                    pass

        return HttpResponse(status=200)
    return HttpResponse(status=405)