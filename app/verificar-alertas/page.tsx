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
  risco: string;
  createdAt: Date;
}

const mapOldRisco = (risco: string) => {
  switch (risco) {
    case "red":
      return "alto";
    case "orange":
      return "alto";
    case "yellow":
      return "medio";
    case "green":
      return "baixo";
    case "purple":
      return "critico";
    case "Crítico":
      return "critico";
    case "Alto":
      return "alto";
    case "Médio":
      return "medio";
    case "Baixo":
      return "baixo";
    default:
      return risco;
  }
};

export default function VerificarAlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [mapCenter, setMapCenter] = useState<number[]>([
    -22.5632085,
    -47.4043372,
  ]);

  const fetchAlerts = async () => {
    const querySnapshot = await getDocs(collection(db, "alerts"));

    const data = querySnapshot.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: docSnap.id,
        titulo: d.titulo,
        descricao: d.descricao,
        latitude: d.latitude,
        longitude: d.longitude,
        risco: d.risco || mapOldRisco(d.nivelRisco),
        createdAt: d.createdAt?.toDate() || new Date(),
      };
    }) as Alert[];

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
      filtered = filtered.filter((alert) => alert.risco === colorFilter);
    }

    setFilteredAlerts(filtered);
  }, [searchTerm, colorFilter, alerts]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este alerta?")) {
      await deleteDoc(doc(db, "alerts", id));
      fetchAlerts();
      alert("Alerta excluído com sucesso!");
    }
  };

  const handleViewOnMap = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude]);
  };

  return (
    <div className="min-h-screen bg-gray-200">

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-[1600px] mx-auto px-8 py-10">

        {/* TÍTULO CENTRAL */}
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
          Verificação de Alertas
        </h1>

        {/* FILTROS */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="col-span-2 border border-gray-300 p-3 rounded-md w-full"
            />

            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-md w-full"
            >
              <option value="">Todos os níveis de risco</option>
              <option value="baixo">Baixo</option>
              <option value="medio">Médio</option>
              <option value="alto">Alto</option>
              <option value="critico">Crítico</option>
            </select>

            <button
              onClick={fetchAlerts}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Atualizar
            </button>

          </div>

          <p className="mt-4 text-gray-700">
            <strong>Total de alertas:</strong> {filteredAlerts.length}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* LISTA */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Lista de Alertas</h2>

            <AlertList
              alerts={filteredAlerts}
              onDelete={handleDelete}
              onViewOnMap={handleViewOnMap}
              showRiskLevel={true}
              showLatitude={false}
              showLongitude={false}
              smallButtons={true}
            />
          </div>

          {/* MAPA */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mapa de Alertas</h2>

            <AlertMap
              alerts={filteredAlerts}
              center={mapCenter as [number, number]}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
