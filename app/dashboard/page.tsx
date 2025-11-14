"use client";

import dynamicImport from "next/dynamic";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

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
      <p className="mb-4">Total de usuários: {userCount}</p>
      <div className="h-[500px]">
        <Map focusLat={focusLat} focusLng={focusLng} />
      </div>
    </div>
  );
  
}





