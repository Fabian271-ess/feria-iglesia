import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useProductos } from "../context/ProductosContext"
import { useAuthUser } from "../lib/useAuthUser"
import { EstadoAcceso } from "../components/EstadoAcceso"
import { NOMBRES_CARPA } from "../lib/carpas"
import { suscribirCarpa } from "../lib/inventario"
import { useOnlineStatus } from "../lib/useOnlineStatus"
import { generarPDFResumen } from "../lib/pdf"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

export default function InventarioResumen() {
  const online = useOnlineStatus()
  const { user, rol, cargando } = useAuthUser()
  const { productos } = useProductos()
  const [ventas1, setVentas1] = useState({})
  const [ventas2, setVentas2] = useState({})

  const rolEsGerente = rol?.startsWith("gerente_")
  const carpaGerente = rolEsGerente ? rol.replace("gerente_", "") : null
  const puedeEntrar = rol === "admin" || rol === "resumen" || rolEsGerente

  useEffect(() => {
    if (!puedeEntrar) return
    const unsubs = []
    if (!rolEsGerente || carpaGerente === "carpa1") unsubs.push(suscribirCarpa("carpa1", setVentas1))
    if (!rolEsGerente || carpaGerente === "carpa2") unsubs.push(suscribirCarpa("carpa2", setVentas2))
    return () => unsubs.forEach((unsub) => unsub())
  }, [puedeEntrar, rolEsGerente, carpaGerente])

  if (cargando || !user || !puedeEntrar) {
    return (
      <EstadoAcceso
        cargando={cargando}
        user={user}
        autorizado={puedeEntrar}
        titulo="Resumen — Iniciar sesión"
        emoji="📊"
        mensajeDenegado="Tu cuenta no tiene acceso al resumen."
      />
    )
  }

  const calcularTotal = (ventas) => productos.reduce((acc, p) => acc + (ventas[p.idProducto] || 0) * p.precio, 0)
  const total1 = calcularTotal(ventas1)
  const total2 = calcularTotal(ventas2)
  const totalGeneral = total1 + total2
  const miTotal = carpaGerente === "carpa1" ? total1 : total2
  const misVentas = carpaGerente === "carpa1" ? ventas1 : ventas2

  const generarResumenTexto = () => {
    const fecha = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
    let texto = `📊 *Cierre de caja - Feria Corazones Fuertes*\n🗓 ${fecha}\n\n`
    if (rolEsGerente) {
      texto += `⛺ ${NOMBRES_CARPA[carpaGerente]}: $${miTotal.toLocaleString("es-CO")}\n\n`
    } else {
      texto += `⛺ Carpa 1: $${total1.toLocaleString("es-CO")}\n`
      texto += `⛺ Carpa 2: $${total2.toLocaleString("es-CO")}\n\n`
      texto += `💰 *TOTAL: $${totalGeneral.toLocaleString("es-CO")}*\n\n`
    }
    texto += `Detalle por producto:\n`
    const combinado = {}
    productos.forEach((p) => {
      const cant = rolEsGerente ? (misVentas[p.idProducto] || 0) : (ventas1[p.idProducto] || 0) + (ventas2[p.idProducto] || 0)
      if (cant > 0) combinado[p.nombreProducto] = { cant, subtotal: cant * p.precio }
    })
    const entradas = Object.entries(combinado)
    if (entradas.length === 0) texto += "(sin ventas registradas)\n"
    else entradas.forEach(([nombre, { cant, subtotal }]) => { texto += `• ${nombre}: ${cant} uds - $${subtotal.toLocaleString("es-CO")}\n` })
    return texto
  }

  const copiarResumen = async () => {
    try {
      await navigator.clipboard.writeText(generarResumenTexto())
      toast.success("Resumen copiado")
    } catch {
      toast.error("No se pudo copiar")
    }
  }

  const enviarPorWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(generarResumenTexto())}`, "_blank")
  }

  const descargarPDF = () => {
    const fecha = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
    const productosPDF = []
    productos.forEach((p) => {
      const cant = rolEsGerente ? (misVentas[p.idProducto] || 0) : (ventas1[p.idProducto] || 0) + (ventas2[p.idProducto] || 0)
      if (cant > 0) productosPDF.push({ nombre: p.nombreProducto, cant, subtotal: cant * p.precio })
    })
    generarPDFResumen({
      titulo: rolEsGerente ? `Cierre de caja — ${NOMBRES_CARPA[carpaGerente]}` : "Cierre de caja general",
      fecha,
      totalGeneral: rolEsGerente ? miTotal : totalGeneral,
      carpas: rolEsGerente ? null : [
        { nombre: "Carpa 1", total: total1 },
        { nombre: "Carpa 2", total: total2 },
      ],
      productos: productosPDF,
    })
  }

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      {!online && (
        <div className="w-full py-2 px-4 text-center font-bold uppercase" style={{ background: "#8b0000", color: "#f5e6c8", fontSize: "12px", letterSpacing: "1px" }}>
          ⚠ Sin conexión — el total que ves puede no estar actualizado
        </div>
      )}
      <div className="w-full py-8 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Link to="/inventario" style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>← INVENTARIO</Link>
        </div>
        <h1 className="font-black uppercase mt-1" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "4px" }}>
          {rolEsGerente ? `Resumen — ${NOMBRES_CARPA[carpaGerente]}` : "Resumen general"}
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
        <div className="rounded-2xl px-6 py-10 mb-6 text-center" style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.03))", border: "1px solid rgba(212,168,67,0.4)" }}>
          <p className="uppercase mb-2" style={{ color: "rgba(212,168,67,0.6)", fontSize: "11px", letterSpacing: "4px" }}>{rolEsGerente ? "Total de tu carpa" : "Total combinado"}</p>
          <p className="font-black" style={{ color: "#f2c96e", fontSize: "48px", fontFamily: "'Arial Black', sans-serif" }}>
            ${(rolEsGerente ? miTotal : totalGeneral).toLocaleString("es-CO")}
          </p>
        </div>

        {!rolEsGerente && (
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
        )}

        <p className="text-xs text-center mt-8" style={{ color: "rgba(212,168,67,0.35)" }}>
          Se actualiza en vivo a medida que {rolEsGerente ? "tu carpa registra" : "cada carpa registra"} ventas.
        </p>

        <div className="flex flex-col gap-3 mt-8">
          <button onClick={enviarPorWhatsApp} className="flex items-center justify-center gap-2 rounded-lg py-3 font-black uppercase transition-all duration-200 active:scale-95" style={{ background: "#25D366", color: "#0a1a0a", letterSpacing: "1px", fontSize: "13px" }}>
            🟢 Cerrar caja y enviar por WhatsApp
          </button>
          <button onClick={copiarResumen} className="rounded-lg py-3 font-bold uppercase transition-all duration-200 active:scale-95" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843", letterSpacing: "1px", fontSize: "12px" }}>
            📋 Copiar resumen
          </button>
          <button onClick={descargarPDF} className="rounded-lg py-3 font-bold uppercase transition-all duration-200 active:scale-95" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843", letterSpacing: "1px", fontSize: "12px" }}>
            📄 Descargar PDF
          </button>
          {rol !== "resumen" && (
            <Link to="/inventario/productos" className="rounded-lg py-3 font-bold uppercase text-center transition-all duration-200 active:scale-95" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843", letterSpacing: "1px", fontSize: "12px" }}>
              🛠️ {rolEsGerente ? "Mis productos" : "Administrar productos"}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}