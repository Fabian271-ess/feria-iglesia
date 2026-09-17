import { Link } from "react-router-dom"
import { useAuthUser } from "../lib/useAuthUser"
import { useCerrarSesion } from "../lib/useCerrarSesion"
import { EstadoAcceso } from "../components/EstadoAcceso"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

const TODAS_LAS_OPCIONES = [
  { to: "/inventario/carpa1", emoji: "⛺", titulo: "Carpa 1", desc: "Registrar ventas de esta carpa", roles: ["admin", "gerente_carpa1"] },
  { to: "/inventario/carpa2", emoji: "⛺", titulo: "Carpa 2", desc: "Registrar ventas de esta carpa", roles: ["admin", "gerente_carpa2"] },
  { to: "/inventario/resumen", emoji: "📊", titulo: "Resumen", desc: "Ver el total en vivo", roles: ["admin", "resumen", "gerente_carpa1", "gerente_carpa2"] },
  { to: "/inventario/productos", emoji: "🛠️", titulo: "Productos", desc: "Crear o eliminar productos", roles: ["admin", "gerente_carpa1", "gerente_carpa2"] },
]

export default function Inventario() {
  const { user, rol, cargando } = useAuthUser()
  const cerrarSesion = useCerrarSesion()
  const puedeEntrar = !!rol

  if (cargando || !user || !puedeEntrar) {
    return (
      <EstadoAcceso
        cargando={cargando}
        user={user}
        autorizado={puedeEntrar}
        titulo="Inventario — Iniciar sesión"
        emoji="📦"
        mensajeDenegado="Tu cuenta no tiene un rol asignado en el inventario."
      />
    )
  }

  const opciones = TODAS_LAS_OPCIONES.filter((op) => op.roles.includes(rol))

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "6px" }}>FERIA CORAZONES FUERTES</p>
        <h1 className="font-black uppercase mt-2" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "6px" }}>
          Inventario
        </h1>
        <div className="w-16 h-px mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        <button onClick={cerrarSesion} className="mt-4 text-xs font-bold uppercase" style={{ color: "rgba(212,168,67,0.5)", letterSpacing: "2px" }}>
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-5">
        {opciones.map((op) => (
          <Link
            key={op.to}
            to={op.to}
            className="flex items-center gap-5 py-6 px-6 rounded-2xl transition-all duration-300 active:scale-95"
            style={{ background: "rgba(26,2,5,0.85)", border: "1px solid rgba(212,168,67,0.2)" }}
            onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #d4a843"; e.currentTarget.style.background = "rgba(212,168,67,0.06)" }}
            onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.background = "rgba(26,2,5,0.85)" }}
          >
            <span style={{ fontSize: "40px" }}>{op.emoji}</span>
            <div className="flex flex-col text-left">
              <span className="font-black uppercase" style={{ color: "#d4a843", letterSpacing: "2px", fontSize: "15px", fontFamily: "'Arial Black', sans-serif" }}>
                {op.titulo}
              </span>
              <span style={{ color: "rgba(212,168,67,0.5)", fontSize: "12px", marginTop: "2px" }}>
                {op.desc}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
