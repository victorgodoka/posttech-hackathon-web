import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validar se as variáveis foram carregadas
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Definida' : '❌ Faltando',
    authDomain: firebaseConfig.authDomain ? '✅ Definida' : '❌ Faltando',
    projectId: firebaseConfig.projectId ? '✅ Definida' : '❌ Faltando',
    appId: firebaseConfig.appId ? '✅ Definida' : '❌ Faltando',
  });
  
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ ERRO: Variáveis de ambiente do Firebase não foram carregadas!');
    console.error('Certifique-se de que o arquivo .env.local existe e o servidor foi reiniciado.');
  }
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth, app };
