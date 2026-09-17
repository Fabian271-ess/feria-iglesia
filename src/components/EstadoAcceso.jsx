import { useNavigate } from "react-router-dom"
import LoginModal from "./LoginModal"
import { useCerrarSesion } from "../lib/useCerrarSesion"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

// Bloque de acceso compartido por las páginas de inventario: mientras carga la sesión no
// muestra nada, si no hay sesión abre el mismo modal de login que el resto del sitio, y
// si el rol no alcanza explica por qué.
export function EstadoAcceso({ cargando, user, autorizado, titulo, emoji, mensajeDenegado }) {
  const navigate = useNavigate()
  const cerrarSesion = useCerrarSesion()

  if (cargando) return null

  if (!user) {
    return <LoginModal abierto titulo={titulo} emoji={emoji} onClose={() => navigate("/")} onSuccess={() => {}} />
  }

  if (!autorizado) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }} className="flex flex-col items-center justify-center px-4 gap-4">
        <p style={{ color: "rgba(212,168,67,0.6)" }}>{mensajeDenegado}</p>
        <button onClick={cerrarSesion} className="text-xs underline" style={{ color: "rgba(212,168,67,0.5)" }}>Cerrar sesión</button>
      </div>
    )
  }
  return null
}
