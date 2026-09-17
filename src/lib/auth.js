import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"

export function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function cerrarSesion() {
  return signOut(auth)
}

// callback(user | null) — se llama cada vez que cambia el estado de sesión.
export function suscribirAuth(callback) {
  return onAuthStateChanged(auth, callback)
}