from django.shortcuts import render

def index(request):
    # Pode servir para renderizar uma página simples de status ou docs da API
    return render(request, 'index.html')