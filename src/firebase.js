import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcABvvPre2aq86wmattxhUaYbgqkd0L2M",
  authDomain: "skullking-c31e0.firebaseapp.com",
  projectId: "skullking-c31e0",
  storageBucket: "skullking-c31e0.firebasestorage.app",
  messagingSenderId: "1091154820537",
  appId: "1:1091154820537:web:4021b8b2c161b739108a68"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);