import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC82ErJqHLw5H0qcveYMSgzyu7LM723aUA',
  authDomain: 'music-app-aa8e2.firebaseapp.com',
  projectId: 'music-app-aa8e2',
  storageBucket: 'music-app-aa8e2.appspot.com',
  messagingSenderId: '288319402004',
  appId: '1:288319402004:web:382220efb9d68f2d2db701'
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage()

export { auth, app, db, storage }
