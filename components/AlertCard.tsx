import { db } from "@/lib/firebase"; // Importe sua instância do Firestore
import { collection, addDoc } from "firebase/firestore";

export const addAlert = async (name: string, street: string, description: string, latitude: number, longitude: number) => {
  try {
    // Adiciona um novo documento na coleção "alerts" do Firestore
    await addDoc(collection(db, "alerts"), {
      name,
      street,
      description,
      latitude,
      longitude,
      timestamp: new Date(), // Registra a data e hora do alerta
    });
  } catch (error) {
    console.error("Erro ao cadastrar alerta:", error);
  }
};
