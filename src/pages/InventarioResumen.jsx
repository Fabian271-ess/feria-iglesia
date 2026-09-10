import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { productos } from "../data/productos"
import { suscribirCarpa } from "../lib/inventario"
import { useOnlineStatus } from "../lib/useOnlineStatus"

const PIN_MAESTRO = import.meta.env.VITE_PIN_MAESTRO
const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

function calcularTotal(ventas) {
  return productos.reduce((acc, p) => acc + (ventas[p.idProducto] || 0) * p.precio, 0)
}

function generarResumenTexto(ventas1, ventas2, total1, total2, totalGeneral) {
  const fecha = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
  let texto = `📊 *Cierre de caja - Feria Corazones Fuertes*\n🗓 ${fecha}\n\n`
  texto += `⛺ Carpa 1: $${total1.toLocaleString("es-CO")}\n`
  texto += `⛺ Carpa 2: $${total2.toLocaleString("es-CO")}\n\n`
  texto += `💰 *TOTAL: $${totalGeneral.toLocaleString("es-CO")}*\n\n`
  texto += `Detalle por producto:\n`

  const combinado = {}
  productos.forEach((p) => {
    const cant = (ventas1[p.idProducto] || 0) + (ventas2[p.idProducto] || 0)
    if (cant > 0) combinado[p.nombreProducto] = { cant, subtotal: cant * p.precio }
  })

  const entradas = Object.entries(combinado)
  if (entradas.length === 0) {
    texto += "(sin ventas registradas)\n"
  } else {
    entradas.forEach(([nombre, { cant, subtotal }]) => {
      texto += `• ${nombre}: ${cant} uds - $${subtotal.toLocaleString("es-CO")}\n`
    })
  }

  return texto
}

export default function InventarioResumen() {
  const online = useOnlineStatus()
  const [desbloqueado, setDesbloqueado] = useState(
    () => sessionStorage.getItem("inv_resumen") === "ok"
  )
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [ventas1, setVentas1] = useState({})
  const [ventas2, setVentas2] = useState({})

  useEffect(() => {
    if (!desbloqueado) return
    const unsub1 = suscribirCarpa("carpa1", setVentas1)
    const unsub2 = suscribirCarpa("carpa2", setVentas2)
    return () => {
      unsub1()
      unsub2()
    }
  }, [desbloqueado])

  const intentarEntrar = (e) => {
    e.preventDefault()
    if (pin === PIN_MAESTRO) {
      sessionStorage.setItem("inv_resumen", "ok")
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
          <p className="text-center mb-1" style={{ fontSize: "40px" }}>📊</p>
          <h1 className="font-black uppercase text-center mb-6" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "18px", letterSpacing: "3px" }}>
            Resumen general
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

  const total1 = calcularTotal(ventas1)
  const total2 = calcularTotal(ventas2)
  const totalGeneral = total1 + total2

  const copiarResumen = async () => {
    const texto = generarResumenTexto(ventas1, ventas2, total1, total2, totalGeneral)
    try {
      await navigator.clipboard.writeText(texto)
      toast.success("Resumen copiado")
    } catch {
      toast.error("No se pudo copiar")
    }
  }

  const enviarPorWhatsApp = () => {
    const texto = generarResumenTexto(ventas1, ventas2, total1, total2, totalGeneral)
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank")
  }

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      {!online && (
        <div
          className="w-full py-2 px-4 text-center font-bold uppercase"
          style={{ background: "#8b0000", color: "#f5e6c8", fontSize: "12px", letterSpacing: "1px" }}
        >
          ⚠ Sin conexión — el total que ves puede no estar actualizado
        </div>
      )}
      <div className="w-full py-8 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <Link to="/inventario" style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>← INVENTARIO</Link>
        <h1 className="font-black uppercase mt-3" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "4px" }}>
          Resumen general
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
        <div
          className="rounded-2xl px-6 py-10 mb-6 text-center"
          style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.03))", border: "1px solid rgba(212,168,67,0.4)" }}
        >
          <p className="uppercase mb-2" style={{ color: "rgba(212,168,67,0.6)", fontSize: "11px", letterSpacing: "4px" }}>Total combinado</p>
          <p className="font-black" style={{ color: "#f2c96e", fontSize: "48px", fontFamily: "'Arial Black', sans-serif" }}>
            ${totalGeneral.toLocaleString("es-CO")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl px-4 py-6 text-center" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)" }}>
            <p style={{ fontSize: "28px" }}>⛺</p>
            <p className="font-bold uppercase mt-1" style={{ color: "rgba(212,168,67,0.6)", fontSize: "11px", letterSpacing: "2px" }}>Carpa 1</p>
            <p className="font-black mt-1" style={{ color: "#d4a843", fontSize: "22px", fontFamily: "'Arial Black', sans-serif" }}>
              ${total1.toLocaleString("es-CO")}
            </p>
          </div>
          <div className="rounded-xl px-4 py-6 text-center" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)" }}>
            <p style={{ fontSize: "28px" }}>⛺</p>
            <p className="font-bold uppercase mt-1" style={{ color: "rgba(212,168,67,0.6)", fontSize: "11px", letterSpacing: "2px" }}>Carpa 2</p>
            <p className="font-black mt-1" style={{ color: "#d4a843", fontSize: "22px", fontFamily: "'Arial Black', sans-serif" }}>
              ${total2.toLocaleString("es-CO")}
            </p>
          </div>
        </div>

        <p className="text-xs text-center mt-8" style={{ color: "rgba(212,168,67,0.35)" }}>
          Se actualiza en vivo a medida que cada carpa registra ventas.
        </p>

        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={enviarPorWhatsApp}
            className="flex items-center justify-center gap-2 rounded-lg py-3 font-black uppercase transition-all duration-200 active:scale-95"
            style={{ background: "#25D366", color: "#0a1a0a", letterSpacing: "1px", fontSize: "13px" }}
          >
            🟢 Cerrar caja y enviar por WhatsApp
          </button>
          <button
            onClick={copiarResumen}
            className="rounded-lg py-3 font-bold uppercase transition-all duration-200 active:scale-95"
            style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843", letterSpacing: "1px", fontSize: "12px" }}
          >
            📋 Copiar resumen
          </button>
        </div>
      </div>
    </div>
  )
}