"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AlertPage() {
  const [rua, setRua] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cor, setCor] = useState("red");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleAddAlert = async () => {
    if (!rua || !lat || !lng) {
      alert("Preencha todos os campos!");
      return;
    }

    await addDoc(collection(db, "alerts"), {
      rua,
      descricao,
      cor,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });

    alert("Alerta cadastrado com sucesso!");
    // Clear form fields
    setRua("");
    setDescricao("");
    setCor("red");
    setLat("");
    setLng("");
    // Real-time updates are handled by onSnapshot in other components
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Cadastrar Alerta
      </h1>

      <input
        type="text"
        placeholder="Nome da Rua"
        value={rua}
        onChange={(e) => setRua(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-3 rounded"
      />

      <textarea
        placeholder="Descrição do perigo"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-3 rounded"
      />

      <label className="block mb-2 font-semibold text-gray-700">
        Cor do marcador:
      </label>
      <select
        value={cor}
        onChange={(e) => setCor(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-3 rounded"
      >
        <option value="red">Vermelho (Alto perigo)</option>
        <option value="orange">Laranja (Médio perigo)</option>
        <option value="green">Verde (Baixo perigo)</option>
      </select>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="border border-gray-300 p-2 w-1/2 rounded"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="border border-gray-300 p-2 w-1/2 rounded"
        />
      </div>

      <button
        onClick={handleAddAlert}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4 p-2 w-full rounded-lg transition"
      >
        Salvar Alerta
      </button>
    </div>
  );
}
