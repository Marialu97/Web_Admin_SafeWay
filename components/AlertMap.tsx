"use client";

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface Alert {
  id: string;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  risco: string;
  createdAt: Date;
}

interface AlertMapProps {
  alerts: Alert[];
  center: [number, number];
}

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
};

export default function AlertMap({ alerts, center }: AlertMapProps) {
  const getRiskColor = (nivelRisco: string) => {
    const colorMap: Record<string, string> = {
      'Crítico': 'red',
      'Alto': 'orange',
      'Médio': 'yellow',
      'Baixo': 'green'
    };
    return colorMap[nivelRisco] || 'gray';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      });
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Mapa de Alertas</h2>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={center}
          zoom={13}
          minZoom={13}
          maxZoom={18}
          maxBounds={[
            [-22.67, -47.52],
            [-22.45, -47.27],
          ]}
          maxBoundsViscosity={1.0}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {alerts.map((alert) => (
            <Circle
              key={alert.id}
              center={[alert.latitude, alert.longitude]}
              radius={50}
<<<<<<< HEAD
              color={getColor(alert.risco)}
              fillColor={getColor(alert.risco)}
=======
              color={getRiskColor(alert.nivelRisco)}
              fillColor={getRiskColor(alert.nivelRisco)}
>>>>>>> 0dfeb0266bdf5fc8730e1d266ff4ffd4872d36df
              fillOpacity={0.6}
            >
              <Popup>
                <strong>Título do Alerta:</strong> {alert.titulo || 'Sem título'} <br />
                <strong>Descrição:</strong> {alert.descricao || 'Sem descrição'} <br />
<<<<<<< HEAD
                <strong>Nível de Risco:</strong> {getRiskText(alert.risco)} <br />
=======
                <strong>Nível de Risco:</strong> {alert.nivelRisco || 'Não informado'} <br />
>>>>>>> 0dfeb0266bdf5fc8730e1d266ff4ffd4872d36df
                <strong>Latitude:</strong> {alert.latitude} <br />
                <strong>Longitude:</strong> {alert.longitude}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
