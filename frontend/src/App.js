// frontend/src/App.js

import React, { useState } from "react";
import PizzaCard from "./components/PizzaCard"; // Ajuste o caminho se necessário

function App() {
  const [carrinho, setCarrinho] = useState([]);

  const pizzas = [
    {
      id: 1,
      nome: "Pizza Calabresa",
      descricao: "Molho, mussarela, calabresa e cebola.",
      preco: "45.00",
      imagem:
        "https://t2.rg.ltmcdn.com/pt/posts/8/5/8/pizza_de_calabresa_simples_3858_600.jpg",
    },
    {
      id: 2,
      nome: "Pizza Frango c/ Catupiry",
      descricao: "Frango desfiado, catupiry e orégano.",
      preco: "52.00",
      imagem:
        "https://www.receiteria.com.br/wp-content/uploads/receitas-de-pizza-de-frango-com-catupiry-1.jpg",
    },
    {
      id: 3,
      nome: "Pizza Marguerita",
      descricao: "Molho, mussarela, tomate e manjericão.",
      preco: "48.00",
      imagem:
        "https://receitasdemassas.com.br/wp-content/uploads/2021/04/pizza-marguerita.jpg",
    },
  ];

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

  const totalCarrinho = carrinho.reduce(
    (acc, item) => acc + parseFloat(item.preco) * item.quantidade,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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

      {/* Rodapé do Carrinho */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
        <span>
          Itens: {carrinho.length} | Total: R$ {totalCarrinho.toFixed(2)}
        </span>
        <button className="bg-green-500 px-4 py-2 rounded font-bold">
          Finalizar
        </button>
      </div>
    </div>
  );
}

export default App;
