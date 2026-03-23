"use client";

import { useState, useEffect } from "react";
import PizzaCard from "../components/PizzaCard";

export default function Home() {
  const [pizzas, setPizzas] = useState([]); // Começa vazio
  const [carrinho, setCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função que busca os dados no Django
  useEffect(() => {
    fetch("http://192.168.100.7:8000/api/produtos/") // Ajuste para sua URL do Django
      .then((response) => response.json())
      .then((data) => {
        setPizzas(data);
        setCarregando(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar pizzas:", error);
        setCarregando(false);
      });
  }, []);

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

  if (carregando)
    return <div className="text-center p-20">Carregando cardápio...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-32">
      <h1 className="text-4xl font-black text-red-600 text-center mb-10">
        PIZZARIA
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

      {/* Barra do Carrinho */}
      {carrinho.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6 shadow-2xl flex justify-between items-center animate-bounce-in">
          <div>
            <p className="font-bold text-gray-800">
              {carrinho.length} itens no carrinho
            </p>
            <p className="text-2xl font-black text-green-600">
              Total: R$ {totalCarrinho.toFixed(2)}
            </p>
          </div>
          <button className="bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 shadow-lg transition-all">
            FECHAR PEDIDO
          </button>
        </div>
      )}
    </main>
  );
}
