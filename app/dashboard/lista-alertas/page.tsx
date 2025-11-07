"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ListaAlertasPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "alerts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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

  const handleEdit = (alert: any) => {
    setEditingAlert(alert);
  };

  const handleSaveEdit = async () => {
    if (editingAlert) {
      await updateDoc(doc(db, "alerts", editingAlert.id), editingAlert);
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
                        value={editingAlert.rua}
                        onChange={(e) => setEditingAlert({ ...editingAlert, rua: e.target.value })}
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
                    <td className="py-2 px-4 border-b">
                      <select
                        value={editingAlert.cor}
                        onChange={(e) => setEditingAlert({ ...editingAlert, cor: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      >
                        <option value="red">Vermelho</option>
                        <option value="blue">Azul</option>
                        <option value="green">Verde</option>
                        <option value="yellow">Amarelo</option>
                        <option value="orange">Laranja</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        step="any"
                        value={editingAlert.lat}
                        onChange={(e) => setEditingAlert({ ...editingAlert, lat: parseFloat(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="number"
                        step="any"
                        value={editingAlert.lng}
                        onChange={(e) => setEditingAlert({ ...editingAlert, lng: parseFloat(e.target.value) })}
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
                    <td className="py-2 px-4 border-b">{alert.rua}</td>
                    <td className="py-2 px-4 border-b">{alert.descricao}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: alert.cor }}
                      ></span>
                      {alert.cor}
                    </td>
                    <td className="py-2 px-4 border-b">{alert.lat}</td>
                    <td className="py-2 px-4 border-b">{alert.lng}</td>
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
                        onClick={() => handleViewOnMap(alert.lat, alert.lng)}
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
