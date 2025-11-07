"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase"; // Firebase auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Cria o admin no Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);
      // Redireciona para a página de dashboard após o cadastro
      router.push("/dashboard");
    } catch (err: any) {
      setError("Erro ao cadastrar o administrador: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Administrador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Digite o email do admin"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Digite a senha do admin"
          />
        </div>

        {/* Exibir erro, caso tenha */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            {loading ? "Cadastrando..." : "Cadastrar Administrador"}
          </button>
        </div>
      </form>
    </div>
  );
}
