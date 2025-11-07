"use client";

import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const getUsers = async () => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUser = async (user: any) => {
  const usersCollection = collection(db, "users");
  return await addDoc(usersCollection, user);
};

export const updateUser = async (id: string, user: any) => {
  const userDoc = doc(db, "users", id);
  return await updateDoc(userDoc, user);
};

export const deleteUser = async (id: string) => {
  const userDoc = doc(db, "users", id);
  return await deleteDoc(userDoc);
};

export const getAlerts = async () => {
  const alertsCollection = collection(db, "alerts");
  const alertsSnapshot = await getDocs(alertsCollection);
  return alertsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addAlert = async (alert: any) => {
  const alertsCollection = collection(db, "alerts");
  return await addDoc(alertsCollection, alert);
};

export const updateAlert = async (id: string, alert: any) => {
  const alertDoc = doc(db, "alerts", id);
  return await updateDoc(alertDoc, alert);
};

export const deleteAlert = async (id: string) => {
  const alertDoc = doc(db, "alerts", id);
  return await deleteDoc(alertDoc);
};
