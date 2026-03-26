import re
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'cpf', 'telefone', 'pontos_fidelidade']
        read_only_fields = ['id', 'pontos_fidelidade']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'cpf', 'telefone']

    def validate_cpf(self, value):
        # Remove pontos e traços
        cpf = re.sub(r'[^0-9]', '', value)
        
        if len(cpf) != 11:
            raise serializers.ValidationError("O CPF deve ter 11 dígitos.")
        
        # Aqui você poderia adicionar a lógica real de validação de dígito verificador
        return cpf

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            cpf=validated_data.get('cpf'),
            telefone=validated_data.get('telefone')
        )
        return user