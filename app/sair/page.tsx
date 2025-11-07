"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth"; // Certifique-se de que o caminho está correto

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logoutAdmin(); // Função para encerrar a sessão do Firebase
        router.push("/login"); // Redireciona para a página de login após o logout
      } catch (err) {
        console.error("Erro ao sair:", err);
      }
    };

    doLogout(); // Chama a função de logout assim que o componente for montado
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-700 text-lg font-medium animate-pulse">
        Saindo...
      </p>
    </div>
  );
}
