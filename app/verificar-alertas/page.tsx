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

export default function VerificarAlertasPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [mapCenter, setMapCenter] = useState<number[]>([-22.5632085, -47.4043372]);

  const fetchAlerts = async () => {
    const querySnapshot = await getDocs(collection(db, "alerts"));
    const data = querySnapshot.docs.map((doc) => {
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
      fetchAlerts(); // Refresh after delete
      alert("Alerta excluído com sucesso!");
    }
  };

  const handleViewOnMap = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Verificação de Alertas
            </h1>
            <p className="text-gray-600 text-center">
              Monitore e gerencie todos os alertas do sistema
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Buscar por título ou descrição"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="min-w-48">
                <select
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos os níveis de risco</option>
                  <option value="baixo">Baixo</option>
                  <option value="medio">Médio</option>
                  <option value="alto">Alto</option>
                  <option value="critico">Crítico</option>
                </select>
              </div>
              <button
                onClick={fetchAlerts}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Atualizar
              </button>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="ml-2 font-semibold text-gray-900">{filteredAlerts.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lista de Alertas</h2>
              </div>
              <div className="p-6">
                <AlertList
                  alerts={filteredAlerts}
                  onDelete={handleDelete}
                  onViewOnMap={handleViewOnMap}
                  showRiskLevel={false}
                  showLatitude={false}
                  showLongitude={false}
                  smallButtons={true}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Mapa de Alertas</h2>
              </div>
              <div className="p-6">
                <AlertMap alerts={filteredAlerts} center={mapCenter as [number, number]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
