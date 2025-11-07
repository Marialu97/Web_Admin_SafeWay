"use client"; // Garantindo que este código é executado apenas no cliente

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth"; // Para deslogar o usuário
import { auth } from "@/lib/firebase"; // Caminho para sua instância do Firebase

export default function LogoutPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Marca o componente como montado no cliente
  }, []);

  useEffect(() => {
    if (isClient) {
      const doLogout = async () => {
        try {
          await signOut(auth); // Desloga o usuário do Firebase
          router.push("/"); // Redireciona para a tela inicial (login)
        } catch (err) {
          console.error("Erro ao sair:", err); // Se der erro, será mostrado no console
        }
      };

      doLogout(); // Chama a função para deslogar e redirecionar
    }
  }, [isClient, router]);

  if (!isClient) return null; // Não renderiza nada até garantir que o código está sendo executado no cliente

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-700 text-lg font-medium animate-pulse">Saindo...</p>
    </div>
  );
}
