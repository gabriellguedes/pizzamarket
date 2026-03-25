import { useState, useEffect } from "react";

export default function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [totalPedidosAnterior, setTotalPedidosAnterior] = useState(0);

  const buscarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/pedidos/");
      if (response.ok) {
        const data = await response.json();
        // Filtramos apenas os pedidos pagos para a cozinha
        const pagos = data.filter((p) => p.status_pagamento === "pago");
        setPedidos(pagos);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setCarregando(false);
    }
  };

  // Inicia o cronômetro de busca (roda apenas UMA vez ao abrir a página)
  useEffect(() => {
    buscarPedidos();

    const intervalo = setInterval(() => {
      buscarPedidos();
    }, 20000); // Busca a cada 20 segundos

    return () => clearInterval(intervalo);
  }, []);

  // Lógica do Som (roda toda vez que a lista de pedidos mudar)
  useEffect(() => {
    if (pedidos.length > totalPedidosAnterior) {
      const audio = new Audio("/notificacao.mp3");
      audio
        .play()
        .catch((e) =>
          console.log("Interaja com a página para habilitar o som"),
        );
    }
    setTotalPedidosAnterior(pedidos.length);
  }, [pedidos]);

  const finalizarPedido = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/pedidos/${id}/finalizar/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        // Remove o pedido da lista localmente para o pizzaiolo ver o resultado na hora
        setPedidos(pedidos.filter((p) => p.id !== id));
      } else {
        alert("Erro ao finalizar pedido no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const dispararImpressao = (id) => {
    const cupomParaImprimir = document.getElementById(`cupom-${id}`);

    if (cupomParaImprimir) {
      cupomParaImprimir.classList.add("print-active");
      window.print();
      cupomParaImprimir.classList.remove("print-active");
    }
  };
  if (carregando)
    return <div className="p-10 text-center">Carregando cozinha...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-yellow-500">
          👨‍🍳 Painel da Cozinha
        </h1>
        <div className="text-sm bg-gray-800 px-4 py-2 rounded-full">
          {pedidos.length} Pedidos para preparar
        </div>
      </header>

      {/* GRID DE PEDIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidos.length === 0 ? (
          <p className="text-gray-400">Nenhum pedido pago no momento...</p>
        ) : (
          pedidos.map((pedido) => (
            /* --- INÍCIO DO CARD DO PEDIDO --- */
            <div
              key={pedido.id}
              className="bg-gray-800 border-l-8 border-green-500 p-6 rounded-lg shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-2xl font-black">#{pedido.id}</span>
                  <span className="text-gray-400 text-sm">
                    {pedido.whatsapp}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-100">
                  {pedido.cliente_nome}
                </h3>

                <ul className="space-y-2 mb-4 border-y border-gray-700 py-4">
                  {pedido.itens.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-lg">
                      <span>
                        <strong className="text-yellow-500">
                          {item.quantidade}x
                        </strong>{" "}
                        {item.nome_produto}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-sm text-gray-400 italic mb-6">
                  📍 {pedido.endereco}
                </div>
              </div>

              {/* --- ÁREA DE BOTÕES (AGORA DENTRO DO CARD CORRETO) --- */}
              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => dispararImpressao(pedido.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  🖨️ Imprimir Cupom
                </button>

                <button
                  onClick={() => finalizarPedido(pedido.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  ✅ Marcar como Pronto
                </button>
              </div>

              {/* --- CONTEÚDO OCULTO PARA IMPRESSÃO --- */}
              <div
                id={`cupom-${pedido.id}`}
                className="hidden print:block secao-impressao"
              >
                <center>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                    PEDIDO #{pedido.id}
                  </h2>
                  <p>-------------------------</p>
                </center>
                <p>
                  <strong>Cliente:</strong> {pedido.cliente_nome}
                </p>
                <p>
                  <strong>Endereço:</strong> {pedido.endereco}
                </p>
                <p>
                  <strong>WhatsApp:</strong> {pedido.whatsapp}
                </p>
                <p>-------------------------</p>
                <p>
                  <strong>ITENS:</strong>
                </p>
                {pedido.itens.map((item, i) => (
                  <p key={i}>
                    {item.quantidade}x {item.nome_produto}
                  </p>
                ))}
                <p>-------------------------</p>
                <center>
                  <p>Bom apetite!</p>
                </center>
              </div>
            </div>
            /* --- FIM DO CARD DO PEDIDO --- */
          ))
        )}
      </div>
    </div>
  );
}
