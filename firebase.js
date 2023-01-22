import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlGdgiH-lG06k6wHYBzhgIj4GX5VFy2uE",
  authDomain: "almas-91d7d.firebaseapp.com",
  projectId: "almas-91d7d",
  storageBucket: "almas-91d7d.appspot.com",
  messagingSenderId: "496650744602",
  appId: "1:496650744602:web:cc3ee83dde134cc4baf2a3",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase();
export const auth = getAuth();
