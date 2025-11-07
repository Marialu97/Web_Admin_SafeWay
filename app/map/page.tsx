'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Importa o componente dinamicamente (sem SSR)
const MapNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function Page() {
  return <MapNoSSR />;
}
