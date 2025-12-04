"use client";

import dynamicImport from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSearchParams } from "next/navigation";



const Map = dynamicImport(() => import("../../components/Map"), { ssr: false });

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const searchParams = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const focusLat = lat && !isNaN(parseFloat(lat)) ? parseFloat(lat) : undefined;
  const focusLng = lng && !isNaN(parseFloat(lng)) ? parseFloat(lng) : undefined;

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUserCount(snapshot.size);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Legenda das Cores */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Legenda - Níveis de Risco</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Crítico</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span>Alto</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Médio</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Baixo</span>
          </div>
        </div>
      </div>

      <div className="h-[500px]">
        <Map focusLat={focusLat} focusLng={focusLng} />
      </div>
    </div>
  );

}





