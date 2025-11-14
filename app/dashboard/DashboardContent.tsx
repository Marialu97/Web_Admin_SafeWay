"use client";

import { useSearchParams } from "next/navigation";
import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";

const Map = dynamicImport(() => import("../../components/Map"), { ssr: false });

export default function DashboardContent() {
  const searchParams = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const focusLat = lat ? parseFloat(lat) : undefined;
  const focusLng = lng ? parseFloat(lng) : undefined;

  return (
    <Map focusLat={focusLat} focusLng={focusLng} />
  );
}
