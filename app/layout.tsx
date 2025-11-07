"use client";

import "../styles/globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Esconde o Navbar em determinadas rotas
  const hideNavbar = pathname === "/" || pathname === "/logout";

  return (
    <html lang="pt-BR">
      <body className="bg-gray-100">
        {!hideNavbar && <Navbar />}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
