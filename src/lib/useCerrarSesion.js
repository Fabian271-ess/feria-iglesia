import { useNavigate } from "react-router-dom"
import { cerrarSesion } from "./auth"

export function useCerrarSesion() {
  const navigate = useNavigate()
  return () => cerrarSesion().then(() => navigate("/"))
}
