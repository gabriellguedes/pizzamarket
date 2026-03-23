// frontend/src/app/page.js

"use client"; // Indica que este é um Componente Cliente (usa useState, useEffect)

import { useState } from "react";
import PizzaCard from "../components/PizzaCard"; // Importa o componente que acabamos de criar

export default function Home() {
  // Estado do Carrinho
  const [carrinho, setCarrinho] = useState([]);

  // Dados simulados de pizzas (substituiremos pela API depois)
  const pizzas = [
    {
      id: 1,
      nome: "Pizza Calabresa",
      descricao: "Molho, mussarela, calabresa e cebola.",
      preco: "45.00",
      imagem:
        "https://cdn0.tudoreceitas.com/pt/posts/9/8/3/pizza_calabresa_e_mussarela_4389_orig.jpg",
    },
    {
      id: 2,
      nome: "Pizza Frango c/ Catupiry",
      descricao: "Frango desfiado, catupiry e orégano.",
      preco: "52.00",
      imagem:
        "https://www.ogastronomo.com.br/upload/1908864693-conheca-a-origem-da-pizza-frango-com-catupiry.jpg",
    },
    {
      id: 3,
      nome: "Pizza Marguerita",
      descricao: "Molho, mussarela, tomate e manjericão.",
      preco: "48.00",
      imagem:
        "https://www.comidaereceitas.com.br/wp-content/uploads/2024/02/pizza-marguerita-com-mozzarella-de-bufala-780x782.jpg",
    },
  ];

  // Lógica para adicionar ao carrinho (a mesma que vimos antes)
  const adicionarAoCarrinho = (produto) => {
    const itemExiste = carrinho.find((item) => item.id === produto.id);

    if (itemExiste) {
      setCarrinho(
        carrinho.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        ),
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  // Calcula o total do carrinho para exibir
  const totalCarrinho = carrinho.reduce(
    (acc, item) => acc + parseFloat(item.preco) * item.quantidade,
    0,
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
        Menu da Pizzaria
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pizzas.map((pizza) => (
          <PizzaCard
            key={pizza.id}
            pizza={pizza}
            onAdicionar={adicionarAoCarrinho}
          />
        ))}
      </div>

      {/* Área do Carrinho */}
      <aside className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            Seu Carrinho ({carrinho.length} itens)
          </h2>
          <ul className="text-sm mt-1">
            {carrinho.map((item) => (
              <li key={item.id}>
                {item.quantidade}x {item.nome} - R${" "}
                {(parseFloat(item.preco) * item.quantidade).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-extrabold">
            Total: R$ {totalCarrinho.toFixed(2)}
          </span>
          <button className="mt-2 bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors">
            Finalizar Pedido
          </button>
        </div>
      </aside>
    </main>
  );
}
