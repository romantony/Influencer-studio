// Client-side Firebase initialization for web app
// Uses provided public config.
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA5ElwaagfUosEkEt5loWaStcEGmHnKTLE',
  authDomain: 'story-factory-4bbdf.firebaseapp.com',
  projectId: 'story-factory-4bbdf',
  storageBucket: 'story-factory-4bbdf.firebasestorage.app',
  messagingSenderId: '1094154683569',
  appId: '1:1094154683569:web:8366b84957d910b33dce90',
  measurementId: 'G-K6PXB25C39',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)

