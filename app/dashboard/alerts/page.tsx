"use client";


import { Suspense } from "react";
import AddAlertPage from "./AddAlertPage";

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <AddAlertPage />
    </Suspense>
  );
}
