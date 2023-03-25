import { defineStore } from 'pinia'
import { auth, db } from '@/includes/firebase'
import {
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore/lite'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values) {
      const user = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const docRef = doc(db, 'users', user.user.uid)

      await setDoc(docRef, {
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await updateProfile(user.user, {
        displayName: values.name
      })

      this.userLoggedIn = true
    },
    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)

      this.userLoggedIn = true
    },
    async signOut() {
      await signOut(auth)

      this.userLoggedIn = false
    }
  }
})
