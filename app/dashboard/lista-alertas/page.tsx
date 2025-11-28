"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Alert {
  id: string;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  risco: string;
  createdAt: Date;
}

export default function ListaAlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const router = useRouter();

<<<<<<< HEAD
  const mapOldRisco = (risco: string) => {
    switch (risco) {
      case 'red':
        return 'alto';
      case 'yellow':
        return 'medio';
      case 'green':
        return 'baixo';
      default:
        return risco; // if already new, or critico
    }
  };

  const getColor = (risco: string) => {
    switch (risco) {
      case 'baixo':
        return 'lightgreen';
      case 'medio':
        return 'yellow';
      case 'alto':
        return 'red';
      case 'critico':
        return 'purple';
      default:
        return 'rgba(0,0,0,0.5)';
    }
  };

  const getRiskText = (risco: string) => {
    switch (risco) {
      case 'baixo':
        return 'Baixo';
      case 'medio':
        return 'Médio';
      case 'alto':
        return 'Alto';
      case 'critico':
        return 'Crítico';
      default:
        return 'Não informado';
    }
=======
  const getRiskDisplay = (nivelRisco: string) => {
    const colorToText: Record<string, string> = {
      'red': 'Crítico',
      'orange': 'Alto',
      'yellow': 'Médio',
      'green': 'Baixo'
    };
    const textToColor: Record<string, string> = {
      'Crítico': 'red',
      'Alto': 'orange',
      'Médio': 'yellow',
      'Baixo': 'green'
    };
    const text = colorToText[nivelRisco] || nivelRisco;
    const color = textToColor[text] || textToColor[nivelRisco] || 'gray';
    return { text, color };
>>>>>>> 0dfeb0266bdf5fc8730e1d266ff4ffd4872d36df
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "alerts"), (snapshot) => {
<<<<<<< HEAD
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          titulo: d.titulo,
          descricao: d.descricao,
          latitude: d.latitude,
          longitude: d.longitude,
          risco: d.risco || mapOldRisco(d.nivelRisco),
          createdAt: d.createdAt?.toDate() || new Date(),
        };
      }) as Alert[];
=======
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        nivelRisco: doc.data().nivelRisco || 'Alto',
      })) as Alert[];
      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
>>>>>>> 0dfeb0266bdf5fc8730e1d266ff4ffd4872d36df
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
              <th className="py-3 px-4 border-b">Título do Alerta</th>
              <th className="py-3 px-4 border-b">Descrição</th>
              <th className="py-3 px-4 border-b">Nível de Risco</th>
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
                    <td className="py-2 px-4 border-b">
                      <select
                        value={editingAlert.risco}
                        onChange={(e) => setEditingAlert({ ...editingAlert, risco: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      >
<<<<<<< HEAD
                        <option value="alto">Alto</option>
                        <option value="medio">Médio</option>
                        <option value="baixo">Baixo</option>
                        <option value="critico">Crítico</option>
=======
                        <option value="Alto">Alto</option>
                        <option value="Médio">Médio</option>
                        <option value="Baixo">Baixo</option>
                        <option value="Crítico">Crítico</option>
>>>>>>> 0dfeb0266bdf5fc8730e1d266ff4ffd4872d36df
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
                    <td className="py-2 px-4 border-b">{alert.titulo || 'Sem título'}</td>
                    <td className="py-2 px-4 border-b">{alert.descricao || 'Sem descrição'}</td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className="inline-block w-4 h-4 rounded-full mr-2"
<<<<<<< HEAD
                        style={{ backgroundColor: getColor(alert.risco) }}
                      ></span>
                      {getRiskText(alert.risco)}
=======
                        style={{ backgroundColor: getRiskDisplay(alert.nivelRisco).color }}
                      ></span>
                      {getRiskDisplay(alert.nivelRisco).text}
>>>>>>> 0dfeb0266bdf5fc8730e1d266ff4ffd4872d36df
                    </td>
                    <td className="py-2 px-4 border-b">{alert.latitude || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{alert.longitude || 'N/A'}</td>
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
