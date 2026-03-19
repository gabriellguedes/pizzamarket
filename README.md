# pizzamarket

pizzaria-root/
├── engine/                # Python (Django)
│   ├── core/
│   │   ├── models/         # Definições do Banco de Dados
│   │   ├── schemas/        # Validação de dados (Pydantic)
│   │   ├── routes/         # Endpoints (pedidos, produtos, pagamentos)
│   │   └── core/           # Configurações de segurança e chaves de API
│   ├── main.py
│   └── requirements.txt
├── frontend/               # JavaScript (React, Vue ou Next.js)
│   ├── src/
│   │   ├── components/     # Botões, Cards de Pizza, Carrinho
│   │   ├── hooks/          # Chamadas de API
│   │   └── pages/          # Home, Checkout, Painel do Dono
│   └── package.json
└── docker-compose.yml      # Para rodar o Banco de Dados (PostgreSQL) fácil
