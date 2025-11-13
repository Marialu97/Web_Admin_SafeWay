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
  name: string;
  street: string;
  description: string;
  latitude: number;
  longitude: number;
  color: string;
  timestamp: Date;
}

interface AlertMapProps {
  alerts: Alert[];
  center: [number, number];
}

export default function AlertMap({ alerts, center }: AlertMapProps) {
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
              color={alert.color || 'red'}
              fillColor={alert.color || 'red'}
              fillOpacity={0.6}
            >
              <Popup>
                <strong>Rua:</strong> {alert.street} <br />
                <strong>Descrição:</strong> {alert.description} <br />
                <strong>Data:</strong> {alert.timestamp.toLocaleString()}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
