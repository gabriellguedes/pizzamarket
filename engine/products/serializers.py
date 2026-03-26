from rest_framework import serializers
from .models import Produto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nome']

class ProdutoSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')

    class Meta:
        model = Produto
        fields = [
            'id', 'categoria', 'categoria_nome', 'nome', 
            'descricao', 'preco', 'imagem', 'disponivel', 'permite_meio_a_meio'
        ]