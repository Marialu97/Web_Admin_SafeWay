"use client";
import { useState } from "react";
import { addAlert } from "@/lib/firestore";

export default function AlertPage() {
  const [street, setStreet] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [color, setColor] = useState("red");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!street || !description || !latitude || !longitude) {
      setError("Todos os campos são obrigatórios!");
      return;
    }

    try {
      await addAlert({
        street,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        color,
      });

      alert("Alerta cadastrado com sucesso!");
      // Clear form fields
      setStreet("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setColor("red");
      setError("");
    } catch (error) {
      setError("Erro ao cadastrar alerta: " + error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Cadastrar Alerta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="block mb-1 font-semibold text-gray-700">
            Nome da Rua
          </label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-semibold text-gray-700">
            Descrição do perigo
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label htmlFor="latitude" className="block mb-1 font-semibold text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label htmlFor="longitude" className="block mb-1 font-semibold text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div>
          <label htmlFor="color" className="block mb-1 font-semibold text-gray-700">
            Cor do marcador
          </label>
          <select
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          >
            <option value="red">Vermelho (Alto perigo)</option>
            <option value="yellow">Amarelo (Médio perigo)</option>
            <option value="green">Verde (Baixo perigo)</option>
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4 p-2 w-full rounded-lg transition"
        >
          Salvar Alerta
        </button>
      </form>
    </div>
  );
}

