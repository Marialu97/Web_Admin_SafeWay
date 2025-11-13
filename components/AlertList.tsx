"use client";

import { useState } from "react";

interface Alert {
  id: string;
  name: string;
  street: string;
  description: string;
  latitude: number;
  longitude: number;
  color: string;
  timestamp: Date;
}

interface AlertListProps {
  alerts: Alert[];
  onDelete: (id: string) => void;
  onViewOnMap: (lat: number, lng: number) => void;
}

export default function AlertList({ alerts, onDelete, onViewOnMap }: AlertListProps) {
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
  };

  const handleSaveEdit = async () => {
    // Implement edit logic if needed
    setEditingAlert(null);
  };

  const handleCancelEdit = () => {
    setEditingAlert(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Lista de Alertas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 border-b">Rua</th>
              <th className="py-3 px-4 border-b">Descrição</th>
              <th className="py-3 px-4 border-b">Cor</th>
              <th className="py-3 px-4 border-b">Data/Hora</th>
              <th className="py-3 px-4 border-b text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-100">
                {editingAlert && editingAlert.id === alert.id ? (
                  <>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={editingAlert.street}
                        onChange={(e) => setEditingAlert({ ...editingAlert, street: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={editingAlert.description}
                        onChange={(e) => setEditingAlert({ ...editingAlert, description: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={editingAlert.color}
                        onChange={(e) => setEditingAlert({ ...editingAlert, color: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      >
                        <option value="red">Vermelho</option>
                        <option value="yellow">Amarelo</option>
                        <option value="green">Verde</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {editingAlert.timestamp.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 border-b">{alert.street}</td>
                    <td className="py-2 px-4 border-b">{alert.description}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: alert.color }}
                      ></span>
                      {alert.color}
                    </td>
                    <td className="py-2 px-4 border-b">{alert.timestamp.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b text-center space-x-2">
                      <button
                        onClick={() => onViewOnMap(alert.latitude, alert.longitude)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Ver no mapa
                      </button>
                      <button
                        onClick={() => onDelete(alert.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Excluir
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {alerts.length === 0 && (
          <p className="text-center py-4 text-gray-500">
            Nenhum alerta encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
