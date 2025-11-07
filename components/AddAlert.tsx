'use client';

import { useState } from 'react';
import { addAlert } from '@/lib/firestore'; // Função para adicionar o alerta ao Firestore

const AddAlert = () => {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [color, setColor] = useState('red');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!latitude || !longitude || !street || !description) {
      setError('Todos os campos são obrigatórios!');
      return;
    }

    try {
      // Chama a função para adicionar o alerta no Firestore
      await addAlert({
        name,
        street,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        color,
      });

      alert('Alerta cadastrado com sucesso!');
      // Limpa os campos do formulário
      setName('');
      setStreet('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setColor('red');
    } catch (error) {
      setError('Erro ao cadastrar alerta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="street">Nome da Rua</label>
        <input
          type="text"
          id="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="border p-2"
        />
      </div>

      <div>
        <label htmlFor="description">Descrição do Perigo</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <label htmlFor="color">Cor do Marcador</label>
        <select
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2"
        >
          <option value="red">Vermelho</option>
          <option value="yellow">Amarelo</option>
          <option value="green">Verde</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2">Salvar Alerta</button>
    </form>
  );
};

export default AddAlert;
