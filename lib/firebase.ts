"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAykEbRJWi-RZTn3afIJnczkYoU7oh3fWE",
  authDomain: "safeway-dev-8542d.firebaseapp.com",
  projectId: "safeway-dev-8542d",
  storageBucket: "safeway-dev-8542d.firebasestorage.app",
  messagingSenderId: "666685520949",
  appId: "1:666685520949:web:6872e05e2ff94299e8c57c",
  measurementId: "G-BL3992JTHB"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
