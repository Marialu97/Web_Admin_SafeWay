'use client';

import { useState } from 'react';
import { addAlert } from '@/lib/firestore'; // Função para adicionar o alerta ao Firestore

const AddAlert = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [nivelRisco, setNivelRisco] = useState('red');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!latitude || !longitude || !titulo || !descricao) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    try {
      // Chama a função para adicionar o alerta no Firestore
      await addAlert({
        titulo,
        descricao,
        nivelRisco,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        createdAt: new Date(),
      });

      alert('Alerta cadastrado com sucesso!');
      // Limpa os campos do formulário
      setTitulo('');
      setDescricao('');
      setLatitude('');
      setLongitude('');
      setNivelRisco('red');
    } catch (error) {
      setError('Erro ao cadastrar alerta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="titulo">Título do Alerta</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="border p-2"
        />
      </div>

      <div>
        <label htmlFor="descricao">Descrição do Perigo</label>
        <input
          type="text"
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="border p-2"
        />
      </div>

      <div>
        <label htmlFor="latitude">Latitude</label>
        <input
          type="text"
          id="latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="border p-2"
        />
      </div>

      <div>
        <label htmlFor="longitude">Longitude</label>
        <input
          type="text"
          id="longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="border p-2"
        />
      </div>

      <div>
        <label htmlFor="nivelRisco">Nível de Risco</label>
        <select
          id="nivelRisco"
          value={nivelRisco}
          onChange={(e) => setNivelRisco(e.target.value)}
          className="border p-2"
        >
          <option value="red">Alto</option>
          <option value="yellow">Médio</option>
          <option value="green">Baixo</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2">Salvar Alerta</button>
    </form>
  );
};

export default AddAlert;
