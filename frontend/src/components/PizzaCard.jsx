// frontend/src/components/PizzaCard.jsx

import React from "react";

const PizzaCard = ({ pizza, onAdicionar }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <img
        src={pizza.imagem || "https://via.placeholder.com/300x200?text=Pizza"}
        alt={pizza.nome}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{pizza.nome}</h3>
        <p className="text-gray-600 text-sm mt-1">{pizza.descricao}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            R$ {parseFloat(pizza.preco).toFixed(2)}
          </span>
          <button
            onClick={() => onAdicionar(pizza)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
