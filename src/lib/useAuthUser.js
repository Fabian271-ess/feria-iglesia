import { useState, useEffect } from "react"
import { suscribirAuth } from "./auth"
import { obtenerRol } from "./roles"

export function useAuthUser() {
  const [user, setUser] = useState(undefined) // undefined = aún cargando
  useEffect(() => suscribirAuth(setUser), [])
  return { user: user || null, rol: obtenerRol(user), cargando: user === undefined }
}