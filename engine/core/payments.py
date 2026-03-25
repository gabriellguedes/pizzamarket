import mercadopago
from django.conf import settings


def gerar_pagamento_pix(pedido):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_TOKEN)

    payment_data = {
        "transaction_amount": float(pedido.total),
        "description": f"Pedido #{pedido.id} - Pizzaria",
        "payment_method_id": "pix",
        "payer": {
            "email": "gguedes10@gmail.com", # O MP EXIGE um e-mail válido (mesmo que fictício)
            "first_name": pedido.cliente_nome,
        }
    }

    payment_response = sdk.payment().create(payment_data)
    payment = payment_response["response"]

    # SE DER ERRO, VAMOS VER O QUE É:
    if "point_of_interaction" not in payment:
        print("--- ERRO DETALHADO DO MERCADO PAGO ---")
        print(payment) # Isso vai mostrar se o token expirou ou se o valor está errado
        raise Exception(f"Mercado Pago Error: {payment.get('message', 'Erro desconhecido')}")

    return {
        "id": payment.get("id"),
        "qr_code": payment["point_of_interaction"]["transaction_data"]["qr_code"],
        "qr_code_base64": payment["point_of_interaction"]["transaction_data"]["qr_code_base64"]
    }
