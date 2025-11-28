'use client';

import { useState } from 'react';
import { addAlert } from '@/lib/firestore'; // Função que adiciona alerta no Firestore

const AddAlert = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [risco, setRisco] = useState('medio');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !descricao || !latitude || !longitude) {
      setError('Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    try {
      // Cria o objeto com todos os dados do alerta
      const newAlert = {
        titulo,
        descricao,
        tipo,
        risco,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId,
        uid: '', // pode ser preenchido depois se quiser
        data: new Date().toISOString(), // gera a data atual automaticamente
      };

      await addAlert(newAlert);

      alert('✅ Alerta cadastrado com sucesso!');
      // Limpa o formulário
      setTitulo('');
      setDescricao('');
      setTipo('nao-informado');
      setRisco('medio');
      setLatitude('');
      setLongitude('');
      setUserId('');
      setError('');
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
        <label htmlFor="titulo" className="block font-semibold text-gray-700 mb-1">
          Título do Alerta
        </label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Ex: Queda de energia no bairro"
        />
      </div>

      <div>
        <label htmlFor="descricao" className="block font-semibold text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Ex: Caiu a força"
        />
      </div>

      <div>
        <label htmlFor="tipo" className="block font-semibold text-gray-700 mb-1">
          Ocorrência
        </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
          required
        >
          <option value="" disabled>Selecione uma ocorrência</option>
          <option value="nao-informado">Não informado</option>
          <option value="acidente">Acidente</option>
          <option value="enchente">Enchente</option>
          <option value="queda-de-energia">Queda de Energia</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="risco" className="block font-semibold text-gray-700 mb-1">
          Nível de Risco
        </label>
        <select
          id="risco"
          value={risco}
          onChange={(e) => setRisco(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
        >
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
          <option value="critico">Crítico</option>
        </select>
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <label htmlFor="latitude" className="block font-semibold text-gray-700 mb-1">
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="-22.57296"
          />
        </div>

        <div className="w-1/2">
          <label htmlFor="longitude" className="block font-semibold text-gray-700 mb-1">
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="-47.40513"
          />
        </div>
      </div>

      <div>
        <label htmlFor="userId" className="block font-semibold text-gray-700 mb-1">
          ID do Usuário
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded"
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

export default AddAlert;
