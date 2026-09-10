import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { productos } from "../data/productos"
import { suscribirCarpa, cambiarCantidad, deshacerUltimoCambio, suscribirHistorialHoy } from "../lib/inventario"
import { useOnlineStatus } from "../lib/useOnlineStatus"

const PINES = {
  carpa1: import.meta.env.VITE_PIN_CARPA1,
  carpa2: import.meta.env.VITE_PIN_CARPA2,
}

const NOMBRES = {
  carpa1: "Carpa 1",
  carpa2: "Carpa 2",
}

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

const EMOJIS = {
  "moñas coquette": "🎀", "moña scrunchie": "🪢", "diademas": "👑",
  "chocomensajes": "💌", "chocolates sueltos": "🍫", "rositas": "🌸",
  "corazones": "❤️", "macetas pequeñas": "🪴", "macetas grandes": "🌳",
}
const getEmoji = (nombre) => EMOJIS[nombre?.toLowerCase()] || "🛍️"

const normalize = (str) =>
  str?.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export default function InventarioCarpa() {
  const { carpa } = useParams() // "carpa1" | "carpa2"
  const online = useOnlineStatus()
  const [desbloqueado, setDesbloqueado] = useState(
    () => sessionStorage.getItem(`inv_${carpa}`) === "ok"
  )
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [ventas, setVentas] = useState({})
  const [busqueda, setBusqueda] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [historial, setHistorial] = useState([])
  const [verHistorial, setVerHistorial] = useState(false)

  useEffect(() => {
    if (!desbloqueado || !carpa) return
    const unsub = suscribirCarpa(carpa, setVentas)
    return unsub
  }, [desbloqueado, carpa])

  useEffect(() => {
    if (!desbloqueado || !carpa) return
    const unsub = suscribirHistorialHoy(carpa, setHistorial)
    return unsub
  }, [desbloqueado, carpa])

  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoriaNombre))
    return ["todas", ...set]
  }, [])

  const productosFiltrados = useMemo(() => {
    const q = normalize(busqueda)
    return productos
      .filter((p) => {
        const coincideCategoria = categoria === "todas" || p.categoriaNombre === categoria
        const coincideBusqueda = !q || normalize(p.nombreProducto).includes(q)
        return coincideCategoria && coincideBusqueda
      })
      .sort((a, b) => a.idProducto - b.idProducto)
  }, [busqueda, categoria])

  if (!carpa || !PINES[carpa]) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }} className="flex items-center justify-center px-4">
        <p style={{ color: "rgba(212,168,67,0.6)" }}>Carpa no válida.</p>
      </div>
    )
  }

  const intentarEntrar = (e) => {
    e.preventDefault()
    if (pin === PINES[carpa]) {
      sessionStorage.setItem(`inv_${carpa}`, "ok")
      setDesbloqueado(true)
      setError("")
    } else {
      setError("PIN incorrecto")
    }
  }

  if (!desbloqueado) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }} className="flex items-center justify-center px-4">
        <div className="w-full max-w-sm py-10 px-8 rounded-2xl" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)" }}>
          <p className="text-center mb-1" style={{ fontSize: "40px" }}>⛺</p>
          <h1 className="font-black uppercase text-center mb-6" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "20px", letterSpacing: "3px" }}>
            {NOMBRES[carpa]}
          </h1>
          <form onSubmit={intentarEntrar} className="flex flex-col gap-3">
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="rounded-lg px-4 py-3 text-center text-lg tracking-widest outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
            />
            {error && <p className="text-sm text-center" style={{ color: "#ff8080" }}>{error}</p>}
            <button
              type="submit"
              className="rounded-lg py-3 font-black uppercase transition-all duration-200 active:scale-95"
              style={{ background: "#d4a843", color: "#1a0205", letterSpacing: "2px", fontSize: "13px" }}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const total = productos.reduce((acc, p) => acc + (ventas[p.idProducto] || 0) * p.precio, 0)

  const handleDeshacer = async () => {
    const deshecho = await deshacerUltimoCambio(carpa)
    if (!deshecho) {
      toast("No hay nada para deshacer", { icon: "ℹ️" })
      return
    }
    toast.success(`Deshecho: ${deshecho.nombreProducto}`)
  }

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      {!online && (
        <div
          className="w-full py-2 px-4 text-center font-bold uppercase"
          style={{ background: "#8b0000", color: "#f5e6c8", fontSize: "12px", letterSpacing: "1px" }}
        >
          ⚠ Sin conexión — tus cambios se guardan en el celular y se enviarán solos cuando vuelva la señal
        </div>
      )}
      {/* Encabezado */}
      <div className="w-full py-8 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Link to="/inventario" style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>← INVENTARIO</Link>
        </div>
        <h1 className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "4px" }}>
          {NOMBRES[carpa]}
        </h1>
        <div
          className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-full"
          style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.3)" }}
        >
          <span style={{ color: "rgba(212,168,67,0.6)", fontSize: "11px", letterSpacing: "1px" }}>TOTAL VENDIDO</span>
          <span className="font-black" style={{ color: "#f2c96e", fontSize: "20px", fontFamily: "'Arial Black', sans-serif" }}>
            ${total.toLocaleString("es-CO")}
          </span>
        </div>
        <div>
          <button
            onClick={handleDeshacer}
            className="mt-3 text-xs font-bold uppercase"
            style={{ color: "rgba(212,168,67,0.5)", letterSpacing: "1px" }}
          >
            ↩ Deshacer último cambio
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        {/* Historial de hoy */}
        <div className="mb-5">
          <button
            onClick={() => setVerHistorial((v) => !v)}
            className="text-xs font-bold uppercase"
            style={{ color: "rgba(212,168,67,0.5)", letterSpacing: "1px" }}
          >
            {verHistorial ? "▲" : "▼"} Historial de hoy ({historial.length})
          </button>

          {verHistorial && (
            <div className="mt-3 flex flex-col gap-1 rounded-xl p-3" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.15)", maxHeight: "220px", overflowY: "auto" }}>
              {historial.length === 0 ? (
                <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "12px" }}>Todavía no hay movimientos hoy.</p>
              ) : (
                historial.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-xs py-1" style={{ borderBottom: "1px solid rgba(212,168,67,0.08)" }}>
                    <span style={{ color: "rgba(245,230,200,0.75)" }}>
                      {h.fecha?.toDate ? h.fecha.toDate().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : "ahora"} · {h.nombreProducto}
                    </span>
                    <span style={{ color: h.delta > 0 ? "#8fd694" : "#ff9b9b", fontWeight: "700" }}>
                      {h.delta > 0 ? `+${h.delta}` : h.delta}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Buscador */}
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar producto..."
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none"
          style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)", color: "#f5e6c8" }}
        />

        {/* Chips de categoría */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" }}>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all duration-200"
              style={{
                letterSpacing: "1px",
                background: categoria === cat ? "#d4a843" : "rgba(212,168,67,0.08)",
                color: categoria === cat ? "#1a0205" : "rgba(212,168,67,0.6)",
                border: "1px solid rgba(212,168,67,0.3)",
              }}
            >
              {cat === "todas" ? "Todas" : cat}
            </button>
          ))}
        </div>

        {/* Lista de productos */}
        {productosFiltrados.length === 0 ? (
          <p className="text-center py-16" style={{ color: "rgba(212,168,67,0.4)" }}>No se encontraron productos.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {productosFiltrados.map((p) => {
              const cantidad = ventas[p.idProducto] || 0
              const subtotal = cantidad * p.precio
              return (
                <div
                  key={p.idProducto}
                  className="flex items-center gap-4 rounded-xl p-3"
                  style={{ background: "rgba(26,2,5,0.9)", border: cantidad > 0 ? "1px solid rgba(212,168,67,0.5)" : "1px solid rgba(212,168,67,0.15)" }}
                >
                  <div className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center" style={{ width: "56px", height: "56px", background: "rgba(139,0,0,0.15)" }}>
                    {p.imagenUrl ? (
                      <img src={p.imagenUrl} alt={p.nombreProducto} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />
                    ) : (
                      <span style={{ fontSize: "24px" }}>{getEmoji(p.categoriaNombre)}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate" style={{ color: "white", fontSize: "13px" }}>{p.nombreProducto}</p>
                    <p style={{ color: "#d4a843", fontSize: "14px", fontWeight: "800" }}>${p.precio.toLocaleString("es-CO")}</p>
                    {cantidad > 0 && (
                      <p style={{ color: "rgba(212,168,67,0.5)", fontSize: "11px" }}>Subtotal: ${subtotal.toLocaleString("es-CO")}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => cambiarCantidad(carpa, p.idProducto, -1, p.nombreProducto)}
                      disabled={cantidad === 0}
                      className="w-9 h-9 rounded-lg font-black text-lg disabled:opacity-20"
                      style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-black" style={{ color: "#f5e6c8", fontSize: "15px" }}>{cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(carpa, p.idProducto, 1, p.nombreProducto)}
                      className="w-9 h-9 rounded-lg font-black text-lg"
                      style={{ background: "#d4a843", color: "#1a0205" }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}