"use client"; // Garantindo que este código é executado apenas no cliente

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Para redirecionar para a página de dashboard após o login
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Importe sua instância do Firebase aqui

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false); // Para garantir que useRouter só seja usado no cliente
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Atualiza para true quando o componente for montado no cliente
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redireciona para o dashboard após o login
    } catch (err: any) {
      setError("Erro ao fazer login: " + err.message);
    }
  };

  if (!isClient) return null; // Não renderiza nada enquanto o componente não for montado no cliente

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Login do Administrador</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium">Senha</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md">
          Entrar
        </button>
      </form>
    </div>
  );
}
