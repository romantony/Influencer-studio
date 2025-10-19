import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyA5ElwaagfUosEkEt5loWaStcEGmHnKTLE',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'story-factory-4bbdf.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'story-factory-4bbdf',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'story-factory-4bbdf.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '1094154683569',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:1094154683569:web:8366b84957d910b33dce90',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-K6PXB25C39'
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0]!;
    }
  }
  return app;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
