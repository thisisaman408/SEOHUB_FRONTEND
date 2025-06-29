// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCt85OOez39L3Wr4sb4y5y-4sHUUut2HfI",
  authDomain: "seo-app-b6991.firebaseapp.com",
  projectId: "seo-app-b6991",
  storageBucket: "seo-app-b6991.firebasestorage.app",
  messagingSenderId: "519943414041",
  appId: "1:519943414041:web:0b9321c0e62ba8f99c6588",
  measurementId: "G-MFVPXDD1SC"
};


const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;
