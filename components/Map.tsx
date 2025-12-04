'use client';

import { MapContainer, TileLayer, GeoJSON, Circle, Popup, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import { useRouter } from 'next/navigation'; // ✅ Importa roteador do Next.js
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

interface Alert {
  id: string;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  nivelRisco: string;
  risco?: string;
}

function MapClickHandler() {
  const router = useRouter();

  // Captura o duplo clique no mapa
  useMapEvents({
    dblclick(e) {
      const { lat, lng } = e.latlng;
      // Redireciona para a página de cadastro com os valores na URL
      router.push(`/dashboard/alerts?lat=${lat}&lng=${lng}`);
    },
  });

  return null;
}

export default function MapaLimeira({ focusLat, focusLng }: { focusLat?: number; focusLng?: number }) {
  const [limeiraData, setLimeiraData] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const getRiskColor = (nivelRisco: string) => {
    const colorMap: Record<string, string> = {
      'Crítico': 'purple',
      'Alto': 'red',
      'Médio': 'yellow',
      'Baixo': 'green'
    };
    return colorMap[nivelRisco] || 'gray';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }

    fetch('/limeira.geojson')
      .then((res) => res.json())
      .then((data) => setLimeiraData(data));
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'alerts'), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const alertData = doc.data();
        return {
          id: doc.id,
          titulo: alertData.titulo || '',
          descricao: alertData.descricao || '',
          latitude: alertData.latitude,
          longitude: alertData.longitude,
          nivelRisco: alertData.nivelRisco || 'Alto', // Default to 'Alto' if not set
        } as Alert;
      });
      setAlerts(data);
    });
    return unsubscribe;
  }, []);

  if (!limeiraData) return <p>Carregando mapa...</p>;

  return (
    <div style={{ height: '800px', width: '100%' }}>
      <MapContainer
        center={focusLat && focusLng ? [focusLat, focusLng] : [-22.5632, -47.4043]}
        zoom={focusLat && focusLng ? 16 : 13}
        minZoom={13}
        maxZoom={18}
        maxBounds={[
          [-22.67, -47.52],
          [-22.45, -47.27],
        ]}
        maxBoundsViscosity={1.0}
        doubleClickZoom={false}
        style={{ height: '800px', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Captura duplo clique */}
        <MapClickHandler />

        <MarkerClusterGroup
          chunkedLoading
          spiderfyOnMaxZoom={false}
          showCoverageOnHover={false}
          maxClusterRadius={50}
          iconCreateFunction={(cluster: { getChildCount: () => any; }) => {
            const count = cluster.getChildCount();
            let color = 'hsla(241, 100%, 50%, 0.60)';
            if (count < 5) color = 'rgba(255, 165, 0, 0.6)';
            if (count >= 5) color = 'rgba(255, 0, 0, 0.6)';
            return L.divIcon({
              html: `<div style="
                background:${color};
                border-radius:50%;
                width:40px;
                height:40px;
                display:flex;
                justify-content:center;
                align-items:center;
                color:white;
                font-weight:bold;
                border:2px solid white;
              ">${count}</div>`,
              className: 'cluster-icon',
            });
          }}
        >
          {alerts.map((alert) => (
            <Circle
              key={alert.id}
              center={[alert.latitude, alert.longitude]}
              radius={50}
              color={getRiskColor(alert.nivelRisco)}
              fillColor={getRiskColor(alert.nivelRisco)}
              fillOpacity={0.6}
            >
              <Popup>
                <strong>Título do Alerta:</strong> {alert.titulo || 'Sem título'} <br />
                <strong>Descrição:</strong> {alert.descricao || 'Sem descrição'} <br />
                <strong>Nível de Risco:</strong> {alert.nivelRisco || 'Não informado'}
              </Popup>
            </Circle>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
