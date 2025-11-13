"use client"; // Garantindo que este código é executado no cliente

import Link from "next/link"; // Adicionando a importação do Link
import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirecionamento
import { signOut } from "firebase/auth"; // Para deslogar
import { auth } from "@/lib/firebase"; // Caminho correto para sua instância do Firebase

export default function Navbar() {
  const router = useRouter(); // Hook de navegação

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Desloga o usuário do Firebase
      router.push("/"); // Redireciona para a página de login (tela inicial)
    } catch (err) {
      console.error("Erro ao sair:", err); // Mostra o erro no console caso algo falhe
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md relative">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">Safeway</div>

        {/* Menu em telas grandes */}
        <div className="hidden md:flex space-x-6">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/users">Users</Link>
          <Link href="/dashboard/alerts">Alerts</Link>
          <Link href="/dashboard/lista-alertas">Lista de Alertas</Link>
          <Link href="/verificar-alertas">Verificação de Alertas</Link>
          <Link href="/dashboard/admin">Novo Admin</Link>
          {/* Botão de logout */}
          <button onClick={handleLogout} className="text-white">Sair</button> {/* Chama a função de logout */}
        </div>
      </div>
    </nav>
  );
}
