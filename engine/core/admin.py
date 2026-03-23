from django.contrib import admin
from .models import Categoria, Produto, Pedido, ItemPedido

# Configuração para exibir os itens dentro do pedido no Admin
class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0 # Não exibe linhas vazias extras
    readonly_fields = ['produto', 'quantidade', 'preco_unitario']

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente_nome', 'status_pagamento', 'status_producao', 'total', 'criado_em']
    list_filter = ['status_pagamento', 'status_producao', 'criado_em']
    search_fields = ['cliente_nome', 'whatsapp']
    inlines = [ItemPedidoInline] # Isso mostra os produtos dentro da tela do pedido

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ['nome', 'categoria', 'preco', 'disponivel']
    list_editable = ['preco', 'disponivel'] # Permite editar direto na listagem
    search_fields = ['nome']
    list_filter = ['categoria', 'disponivel']

admin.site.register(Categoria)