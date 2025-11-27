"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AlertList from "@/components/AlertList";
import AlertMap from "@/components/AlertMap";

interface Alert {
  id: string;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  nivelRisco: string;
  createdAt: Date;
}

export default function VerificarAlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-22.5632085, -47.4043372]);

  const fetchAlerts = async () => {
    const querySnapshot = await getDocs(collection(db, "alerts"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      nivelRisco: doc.data().nivelRisco || 'Alto',
    })) as Alert[];
    data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setAlerts(data);
    setFilteredAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    let filtered = alerts;
    if (searchTerm) {
      filtered = filtered.filter(
        (alert) =>
          alert.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (colorFilter) {
      filtered = filtered.filter((alert) => alert.nivelRisco === colorFilter);
    }
    setFilteredAlerts(filtered);
  }, [searchTerm, colorFilter, alerts]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este alerta?")) {
      await deleteDoc(doc(db, "alerts", id));
      fetchAlerts(); // Refresh after delete
      alert("Alerta excluído com sucesso!");
    }
  };

  const handleViewOnMap = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude]);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Verificação de Alertas
      </h1>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por título ou descrição"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded flex-1 min-w-64"
        />
        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Todos os níveis de risco</option>
          <option value="Alto">Alto</option>
          <option value="Médio">Médio</option>
          <option value="Baixo">Baixo</option>
          <option value="Crítico">Crítico</option>
        </select>
        <button
          onClick={fetchAlerts}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Atualizar
        </button>
        <span className="text-gray-700">
          Total de alertas: {filteredAlerts.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AlertList
          alerts={filteredAlerts}
          onDelete={handleDelete}
          onViewOnMap={handleViewOnMap}
          showRiskLevel={true}
          showLatitude={false}
          showLongitude={false}
          smallButtons={true}
        />
        <AlertMap alerts={filteredAlerts} center={mapCenter as [number, number]} />
      </div>
    </div>
  );
}
