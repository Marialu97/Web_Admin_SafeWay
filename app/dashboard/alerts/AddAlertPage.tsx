"use client";

export const dynamic = "force-dynamic";
import React, { useState, useEffect } from 'react';
import { addAlert } from '@/lib/firestore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const AddAlertPage = () => {
  const searchParams = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState(''); // placeholder inicial vazio
  const [risco, setRisco] = useState(''); // <-- alterado para placeholder vazio
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (latParam && lngParam) {
      setLatitude(latParam);
      setLongitude(lngParam);
    }
  }, [latParam, lngParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // agora valida também o tipo e o risco
    if (!titulo || !descricao || !latitude || !longitude || !tipo || !risco) {
      setError('Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    try {
      const newAlert = {
        titulo,
        descricao,
        tipo,
        risco,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId,
        uid: '',
        data: new Date().toISOString(),
      };

      await addAlert(newAlert);
      alert('✅ Alerta cadastrado com sucesso!');

      // Redirect to dashboard map centered on the new alert
      router.push(`/dashboard?lat=${parseFloat(latitude)}&lng=${parseFloat(longitude)}`);
    } catch (error) {
      console.error(error);
      setError('Erro ao cadastrar alerta.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Cadastrar Alerta
      </h1>

      <div>
        <label className="block font-semibold mb-1">Título do Alerta</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Ex: Queda de energia no bairro"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Ex: Caiu a força"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tipo de Ocorrência</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="" disabled>— Selecione o tipo de ocorrência —</option>
          <option value="roubo">Roubo</option>
          <option value="furto">Furto</option>
          <option value="sequestro">Sequestro</option>
          <option value="assedio">Assédio</option>
          <option value="acidentes">Acidentes</option>
          <option value="estupro">Estupro</option>
          <option value="alagamento">Alagamento</option>
          <option value="queda-de-energia">Queda de Energia</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Nível de Risco</label>
         <select
          value={risco}
          onChange={(e) => setRisco(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="" disabled>— Selecione o Nível de Risco —</option>
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
          <option value="critico">Crítico</option>
        </select>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block font-semibold mb-1">Latitude</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="-22.57296"
            readOnly={!!latParam}
          />
        </div>

        <div className="w-1/2">
          <label className="block font-semibold mb-1">Longitude</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="-47.40513"
            readOnly={!!lngParam}
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">ID do Usuário</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Ex: g7KJvz2mgzZyGALrENXnTWsswm82"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4 p-2 w-full rounded-lg transition"
      >
        Salvar Alerta
      </button>
    </form>
  );
};

export default AddAlertPage;
