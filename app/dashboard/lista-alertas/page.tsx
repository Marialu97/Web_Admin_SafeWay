"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Alert {
  id: string;
  street: string;
  description: string;
  latitude: number;
  longitude: number;
  color: string;
}

export default function ListaAlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "alerts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
      setAlerts(data);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este alerta?")) {
      await deleteDoc(doc(db, "alerts", id));
      // No need to manually update state, onSnapshot will handle it
      alert("Alerta excluído com sucesso!");
    }
  };

  const handleViewOnMap = (lat: number, lng: number) => {
    // Abre o mapa focado na posição do alerta
    router.push(`/dashboard?lat=${lat}&lng=${lng}`);
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
  };

  const handleSaveEdit = async () => {
    if (editingAlert) {
      const { id, ...data } = editingAlert;
      await updateDoc(doc(db, "alerts", editingAlert.id), data);
      setEditingAlert(null);
      alert("Alerta editado com sucesso!");
    }
  };

  const handleCancelEdit = () => {
    setEditingAlert(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Lista de Alertas Cadastrados
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 border-b">Rua</th>
              <th className="py-3 px-4 border-b">Descrição</th>
              <th className="py-3 px-4 border-b">Cor</th>
              <th className="py-3 px-4 border-b">Latitude</th>
              <th className="py-3 px-4 border-b">Longitude</th>
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
                      <input
                        type="number"
                        step="any"
                        value={editingAlert.latitude}
                        onChange={(e) => setEditingAlert({ ...editingAlert, latitude: parseFloat(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        step="any"
                        value={editingAlert.longitude}
                        onChange={(e) => setEditingAlert({ ...editingAlert, longitude: parseFloat(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
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
                    <td className="py-2 px-4 border-b">{alert.latitude}</td>
                    <td className="py-2 px-4 border-b">{alert.longitude}</td>
                    <td className="py-2 px-4 border-b text-center space-x-2">
                      {/* ✏️ editar */}
                      <button
                        onClick={() => handleEdit(alert)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>

                      {/* 🗑️ excluir */}
                      <button
                        onClick={() => handleDelete(alert.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Excluir
                      </button>

                      {/* 🔎 ver no mapa */}
                      <button
                        onClick={() => handleViewOnMap(alert.latitude, alert.longitude)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                      >
                        Ver no mapa
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
            Nenhum alerta cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
