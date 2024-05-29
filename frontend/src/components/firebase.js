import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_api,
  authDomain: import.meta.env.VITE_auth,
  projectId:import.meta.env.VITE_project ,
  storageBucket: import.meta.env.VITE_storage,
  messagingSenderId: import.meta.env.VITE_message,
  appId: import.meta.env.VITE_ID
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)