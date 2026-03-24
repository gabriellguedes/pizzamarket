"use client";

import { useState, useEffect } from "react";
import PizzaCard from "../components/PizzaCard";

export default function Home() {
  const [pizzas, setPizzas] = useState([]); // Começa vazio
  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [cliente, setCliente] = useState({
    nome: "",
    whatsapp: "",
    endereco: "",
  });
  const [carregando, setCarregando] = useState(true);

  // Função que busca os dados na API
  useEffect(() => {
    fetch("http://192.168.100.7:8000/api/produtos/") // Ajuste para a URL da API
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

  const enviarPedido = async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    const dadosPedido = {
      cliente_nome: cliente.nome,
      whatsapp: cliente.whatsapp,
      endereco: cliente.endereco,
      itens: carrinho.map((item) => ({
        produto: item.id,
        quantidade: item.quantidade,
        // O preco_unitario e o total o Django vai calcular sozinho, lembra?
      })),
    };

    try {
      /* Set path of your API*/
      const response = await fetch("http://192.168.100.7:8000/api/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPedido),
      });

      if (response.ok) {
        const pedidoCriado = await response.json();
        alert(
          `Pedido #${pedidoCriado.id} enviado com sucesso! Agora vamos para o pagamento.`,
        );
        setModalAberto(false);
        setCarrinho([]); // Limpa o carrinho
      } else {
        alert("Erro ao enviar pedido. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

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
          <button
            className="bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 shadow-lg transition-all"
            onClick={() => setModalAberto(true)}
          >
            FECHAR PEDIDO
          </button>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Finalizar Pedido</h2>
            <form onSubmit={enviarPedido} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seu Nome
                </label>
                <input
                  required
                  className="w-full border p-3 rounded-lg mt-1"
                  onChange={(e) =>
                    setCliente({ ...cliente, nome: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  WhatsApp
                </label>
                <input
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full border p-3 rounded-lg mt-1"
                  onChange={(e) =>
                    setCliente({ ...cliente, whatsapp: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço de Entrega
                </label>
                <textarea
                  required
                  className="w-full border p-3 rounded-lg mt-1"
                  onChange={(e) =>
                    setCliente({ ...cliente, endereco: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 bg-gray-200 py-3 rounded-lg font-bold"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                >
                  Confirmar e Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
