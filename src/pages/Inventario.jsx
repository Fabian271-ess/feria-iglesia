import { Link } from "react-router-dom"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

const opciones = [
  { to: "/inventario/carpa1", emoji: "⛺", titulo: "Carpa 1", desc: "Registrar ventas de esta carpa" },
  { to: "/inventario/carpa2", emoji: "⛺", titulo: "Carpa 2", desc: "Registrar ventas de esta carpa" },
  { to: "/inventario/resumen", emoji: "📊", titulo: "Resumen general", desc: "Ver el total combinado en vivo" },
  { to: "/inventario/productos", emoji: "🛠️", titulo: "Productos", desc: "Crear, editar o eliminar productos" },
]

export default function Inventario() {
  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "6px" }}>FERIA CORAZONES FUERTES</p>
        <h1 className="font-black uppercase mt-2" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "6px" }}>
          Inventario
        </h1>
        <div className="w-16 h-px mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
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