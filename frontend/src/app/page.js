"use client";

import { useState, useEffect } from "react";
import PizzaCard from "../components/PizzaCard";

export default function Home() {
  const [pizzas, setPizzas] = useState([]); // Começa vazio
  const [carrinho, setCarrinho] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [dadosPix, setDadosPix] = useState(null);

  const [cliente, setCliente] = useState({
    nome: "",
    whatsapp: "",
    endereco: "",
  });
  const [carregando, setCarregando] = useState(true);

  // Função que busca os dados na API
  useEffect(() => {
    fetch("http://localhost:8000/api/produtos/") // Ajuste para a URL da API
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
      const response = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPedido),
      });

      if (response.ok) {
        const pedidoCriado = await response.json();
        setDadosPix(pedidoCriado);

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            {/* Botão de Fechar no topo direito */}
            <button
              onClick={() => {
                setModalAberto(false);
                setDadosPix(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {!dadosPix ? (
              /* --- PARTE 1: O FORMULÁRIO (Aparece primeiro) --- */
              <>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  Finalizar Pedido
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Preencha seus dados para entrega.
                </p>

                <form onSubmit={enviarPedido} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400">
                      Nome
                    </label>
                    <input
                      required
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-500 transition-colors"
                      onChange={(e) =>
                        setCliente({ ...cliente, nome: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400">
                      WhatsApp
                    </label>
                    <input
                      required
                      placeholder="(00) 00000-0000"
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-500 transition-colors"
                      onChange={(e) =>
                        setCliente({ ...cliente, whatsapp: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400">
                      Endereço Completo
                    </label>
                    <textarea
                      required
                      rows="2"
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-500 transition-colors resize-none"
                      onChange={(e) =>
                        setCliente({ ...cliente, endereco: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all mt-4"
                  >
                    Confirmar e Gerar PIX
                  </button>
                </form>
              </>
            ) : (
              /* --- PARTE 2: O QR CODE (Aparece após o POST com sucesso) --- */
              <div className="text-center animate-fade-in">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Pedido Recebido!
                </h2>
                <p className="text-gray-500 mb-6 text-sm">
                  Escaneie o código abaixo para pagar:
                </p>

                {/* QR Code dinâmico vindo do Django */}
                <div className="bg-gray-50 p-4 rounded-2xl inline-block border-2 border-dashed border-gray-200">
                  <img
                    src={`data:image/jpeg;base64,${dadosPix.pix_qr_64}`}
                    className="w-48 h-48 mx-auto"
                    alt="QR Code Pix"
                  />
                </div>

                <div className="mt-6 text-left">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Pix Copia e Cola
                  </label>
                  <div className="flex mt-1">
                    <input
                      readOnly
                      value={dadosPix.pix_copia_e_cola}
                      className="flex-1 bg-gray-100 p-3 rounded-l-lg text-xs truncate border-none focus:ring-0"
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(dadosPix.copiaCola)
                      }
                      className="bg-gray-200 px-4 rounded-r-lg hover:bg-gray-300 transition-colors"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setModalAberto(false);
                    setDadosPix(null);
                    setCarrinho([]);
                  }}
                  className="mt-8 w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Fechar e Voltar ao Início
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
