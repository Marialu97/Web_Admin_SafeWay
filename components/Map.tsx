'use client';

import { MapContainer, TileLayer, GeoJSON, Circle, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaLimeira({ focusLat, focusLng }: { focusLat?: number; focusLng?: number }) {
  const [limeiraData, setLimeiraData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  // 🔹 Corrige os ícones padrão do Leaflet e carrega o GeoJSON
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

    // Carrega o arquivo GeoJSON da cidade de Limeira
    fetch('/limeira.geojson')
      .then((res) => res.json())
      .then((data) => setLimeiraData(data));
  }, []);

  // 🔹 Busca os alertas cadastrados no Firestore com real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'alerts'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlerts(data);
    });
    return unsubscribe; // Cleanup listener on unmount
  }, []);



  if (!limeiraData) return <p>Carregando mapa...</p>;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={focusLat && focusLng ? [focusLat, focusLng] : [-22.565, -47.401]} // centro urbano de Limeira ou foco no alerta
        zoom={focusLat && focusLng ? 16 : 14.5}
        minZoom={13}
        maxZoom={18}
        maxBounds={[
          [-22.67, -47.52],
          [-22.45, -47.27],
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        // @ts-ignore
        whenReady={(mapInstance: any) => {}}
      >
        {/* camada base do mapa */}
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* contorno da cidade */}
        <GeoJSON
          data={limeiraData}
          style={() => ({
            color: '#FF6600',
            weight: 2,
            fillColor: '#FFAA00',
            fillOpacity: 0.25,
          })}
        />

        {/* 🔴 bolinhas de alerta de perigo */}
        {alerts.map((alert) => (
          <Circle
            key={alert.id}
            center={[alert.lat, alert.lng]} // Usando `lat` e `lng` do Firestore
            radius={50} // tamanho do círculo
            color={alert.cor || 'red'} // A cor pode ser `alert.cor` ou vermelho por padrão
            fillColor={alert.cor || 'red'}
            fillOpacity={0.6}
          >
            <Popup>
              <strong>Rua:</strong> {alert.rua} <br />
              <strong>Perigo:</strong> {alert.descricao} <br />
              <strong>Cor:</strong> {alert.cor}
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
