"use client";

import { useState } from "react";

interface Alert {
  id: string;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  risco: string;
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
  showViewOnMapButton?: boolean;
}

// CORES DO RISCO
const getColor = (risco: string) => {
  switch (risco) {
    case "baixo":
      return "lightgreen";
    case "medio":
      return "yellow";
    case "alto":
      return "red";
    case "critico":
      return "purple";
    default:
      return "gray";
  }
};

// TEXTO DO RISCO
const getRiskText = (risco: string) => {
  switch (risco) {
    case "baixo":
      return "Baixo";
    case "medio":
      return "Médio";
    case "alto":
      return "Alto";
    case "critico":
      return "Crítico";
    default:
      return "Não informado";
  }
};

// FUNÇÃO COMPLETA QUE FALTAVA
const getRiskDisplay = (risco: string) => {
  return {
    color: getColor(risco),
    text: getRiskText(risco),
  };
};

export default function AlertList({
  alerts,
  onDelete,
  onViewOnMap,
  showRiskLevel = true,
  showLatitude = true,
  showLongitude = true,
  smallButtons = false,
  showViewOnMapButton = true,
}: AlertListProps) {
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
  };

  const handleSaveEdit = async () => {
    // futuramente você implementa
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
                    {/* EDITAR TÍTULO */}
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={editingAlert.titulo}
                        onChange={(e) =>
                          setEditingAlert({ ...editingAlert, titulo: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>

                    {/* EDITAR DESCRIÇÃO */}
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={editingAlert.descricao}
                        onChange={(e) =>
                          setEditingAlert({ ...editingAlert, descricao: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>

                    {/* EDITAR RISCO */}
                    {showRiskLevel && (
                      <td className="py-2 px-4 border-b">
                        <select
                          value={editingAlert.risco}
                          onChange={(e) =>
                            setEditingAlert({ ...editingAlert, risco: e.target.value })
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="baixo">Baixo</option>
                          <option value="medio">Médio</option>
                          <option value="alto">Alto</option>
                          <option value="critico">Crítico</option>
                        </select>
                      </td>
                    )}

                    {/* EDITAR LATITUDE */}
                    {showLatitude && (
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          step="any"
                          value={editingAlert.latitude}
                          onChange={(e) =>
                            setEditingAlert({
                              ...editingAlert,
                              latitude: parseFloat(e.target.value),
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                    )}

                    {/* EDITAR LONGITUDE */}
                    {showLongitude && (
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          step="any"
                          value={editingAlert.longitude}
                          onChange={(e) =>
                            setEditingAlert({
                              ...editingAlert,
                              longitude: parseFloat(e.target.value),
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                    )}

                    {/* DATA */}
                    <td className="py-2 px-4 border-b">
                      {editingAlert.createdAt?.toLocaleString() || "N/A"}
                    </td>

                    {/* BOTÕES */}
                    <td className="py-2 px-4 border-b text-center space-x-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded" onClick={handleSaveEdit}>
                        Salvar
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded" onClick={handleCancelEdit}>
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* Exibição normal */}
                    <td className="py-2 px-4 border-b">{alert.titulo}</td>
                    <td className="py-2 px-4 border-b">{alert.descricao}</td>

                    {showRiskLevel && (
                      <td className="py-2 px-4 border-b">
                        <span
                          className="inline-block w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: getRiskDisplay(alert.risco).color }}
                        ></span>
                        {getRiskDisplay(alert.risco).text}
                      </td>
                    )}

                    {showLatitude && <td className="py-2 px-4 border-b">{alert.latitude}</td>}
                    {showLongitude && <td className="py-2 px-4 border-b">{alert.longitude}</td>}
                    <td className="py-2 px-4 border-b">{alert.createdAt?.toLocaleString()}</td>

                    <td className="py-2 px-4 border-b text-center">
                      {showRiskLevel && (
                        <div className="flex items-center justify-center mb-2">
                          <span
                            className="inline-block w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: getRiskDisplay(alert.risco).color }}
                          ></span>
                          <span className="text-sm font-medium">{getRiskDisplay(alert.risco).text}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(alert)}
                          className={`bg-blue-600 hover:bg-blue-700 text-white ${
                            smallButtons ? "px-3 py-2 text-sm" : "px-4 py-2"
                          } rounded-md font-medium transition-colors duration-200`}
                        >
                          Editar
                        </button>

                        {showViewOnMapButton && (
                          <button
                            onClick={() => onViewOnMap(alert.latitude, alert.longitude)}
                            className={`bg-blue-600 hover:bg-blue-700 text-white ${
                              smallButtons ? "px-1 py-1 text-sm" : "px-2 py-1"
                            } rounded`}
                          >
                            Ver no mapa
                          </button>
                        )}

                        <button
                          onClick={() => onDelete(alert.id)}
                          className={`bg-red-600 hover:bg-red-700 text-white ${
                            smallButtons ? "px-3 py-2 text-sm" : "px-4 py-2"
                          } rounded-md font-medium transition-colors duration-200`}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {alerts.length === 0 && (
          <p className="text-center py-4 text-gray-500">Nenhum alerta encontrado.</p>
        )}
      </div>
    </div>
  );
}
