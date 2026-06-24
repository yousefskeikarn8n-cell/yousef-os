import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYgOQetyGA3JNT4NAsfVPb8fKZ17awga0",
  authDomain: "yousef-os.firebaseapp.com",
  projectId: "yousef-os",
  storageBucket: "yousef-os.firebasestorage.app",
  messagingSenderId: "287821652696",
  appId: "1:287821652696:web:990ef4d1f4a8a9c7712dad"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
