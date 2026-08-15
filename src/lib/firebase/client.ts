import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6R3LKvhUtrRSLsRMlCTcfhFgNU-ZyrcI",
  authDomain: "jainsathi-2aad1.firebaseapp.com",
  projectId: "jainsathi-2aad1",
  storageBucket: "jainsathi-2aad1.firebasestorage.app",
  messagingSenderId: "721247714466",
  appId: "1:721247714466:web:4d5df3ca577683ecaeebfb",
  measurementId: "G-0W6BM9L9WN"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
