"use client";

import { useState } from "react";

interface Alert {
  id: string;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  nivelRisco: string;
  createdAt: Date;
}

interface AlertListProps {
  alerts: Alert[];
  onDelete: (id: string) => void;
  onViewOnMap: (latitude: number, longitude: number) => void;
  showRiskLevel?: boolean;
  showLatitude?: boolean;
  showLongitude?: boolean;
  smallButtons?: boolean;
}

export default function AlertList({ alerts, onDelete, onViewOnMap, showRiskLevel = true, showLatitude = true, showLongitude = true, smallButtons = false }: AlertListProps) {
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
              <th className="py-3 px-4 border-b">Título do Alerta</th>
              <th className="py-3 px-4 border-b">Descrição</th>
              {showRiskLevel && <th className="py-3 px-4 border-b">Nível de Risco</th>}
              {showLatitude && <th className="py-3 px-4 border-b">Latitude</th>}
              {showLongitude && <th className="py-3 px-4 border-b">Longitude</th>}
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
                        value={editingAlert.titulo}
                        onChange={(e) => setEditingAlert({ ...editingAlert, titulo: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={editingAlert.descricao}
                        onChange={(e) => setEditingAlert({ ...editingAlert, descricao: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    {showRiskLevel && (
                      <td className="py-2 px-4 border-b">
                        <select
                          value={editingAlert.nivelRisco}
                          onChange={(e) => setEditingAlert({ ...editingAlert, nivelRisco: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="red">Alto</option>
                          <option value="yellow">Médio</option>
                          <option value="green">Baixo</option>
                        </select>
                      </td>
                    )}
                    {showLatitude && (
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          step="any"
                          value={editingAlert.latitude}
                          onChange={(e) => setEditingAlert({ ...editingAlert, latitude: parseFloat(e.target.value) })}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                    )}
                    {showLongitude && (
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          step="any"
                          value={editingAlert.longitude}
                          onChange={(e) => setEditingAlert({ ...editingAlert, longitude: parseFloat(e.target.value) })}
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                    )}
                    <td className="py-2 px-4 border-b">
                      {editingAlert.createdAt?.toLocaleString() || 'N/A'}
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
                    <td className="py-2 px-4 border-b">{alert.titulo || 'Sem título'}</td>
                    <td className="py-2 px-4 border-b">{alert.descricao || 'Sem descrição'}</td>
                    {showRiskLevel && (
                      <td className="py-2 px-4 border-b">
                        <span
                          className="inline-block w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: alert.nivelRisco }}
                        ></span>
                        {alert.nivelRisco === 'red' ? 'Alto' : alert.nivelRisco === 'yellow' ? 'Médio' : alert.nivelRisco === 'green' ? 'Baixo' : 'Não informado'}
                      </td>
                    )}
                    {showLatitude && <td className="py-2 px-4 border-b">{alert.latitude || 'N/A'}</td>}
                    {showLongitude && <td className="py-2 px-4 border-b">{alert.longitude || 'N/A'}</td>}
                    <td className="py-2 px-4 border-b">{alert.createdAt?.toLocaleString() || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-center flex space-x-1 justify-center">
                      <button
                        onClick={() => onViewOnMap(alert.latitude, alert.longitude)}
                        className={`bg-blue-600 hover:bg-blue-700 text-white ${smallButtons ? 'px-1 py-1 text-sm' : 'px-2 py-1'} rounded`}
                      >
                        Ver no mapa
                      </button>
                      <button
                        onClick={() => onDelete(alert.id)}
                        className={`bg-red-600 hover:bg-red-700 text-white ${smallButtons ? 'px-1 py-1 text-sm' : 'px-2 py-1'} rounded`}
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
