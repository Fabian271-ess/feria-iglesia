import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useProductos } from "../context/ProductosContext"
import { useCategorias } from "../context/CategoriasContext"
import { useAuthUser } from "../lib/useAuthUser"
import { EstadoAcceso } from "../components/EstadoAcceso"
import { NOMBRES_CARPA } from "../lib/carpas"
import { suscribirCarpa, suscribirStockCarpa, establecerStock, cambiarCantidad, suscribirPendientes, crearPendiente, marcarPendienteComoPagado, eliminarPendiente } from "../lib/inventario"
import { useOnlineStatus } from "../lib/useOnlineStatus"
import { getCategoriaById, getEmojiCategoria } from "../lib/categoriaHelpers"

const NOMBRES = NOMBRES_CARPA
const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export default function InventarioCarpa() {
  const { carpa } = useParams() // "carpa1" | "carpa2"
  const online = useOnlineStatus()
  const { user, rol, cargando } = useAuthUser()
  const { productos, loading: cargandoProductos } = useProductos()
  const { categorias: categoriasFirestore } = useCategorias()

  const [ventas, setVentas] = useState({})
  const [stock, setStock] = useState({})
  const [busqueda, setBusqueda] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [editandoStock, setEditandoStock] = useState(null)
  const [valorStock, setValorStock] = useState("")
  const [verAgregar, setVerAgregar] = useState(false)
  const [pendientes, setPendientes] = useState([])
  const [verPendientes, setVerPendientes] = useState(false)
  const [formPendiente, setFormPendiente] = useState({ nombreComprador: "", idProducto: "", cantidad: 1 })
  const [guardandoPendiente, setGuardandoPendiente] = useState(false)

  const puedeEntrar = rol === "admin" || rol === `gerente_${carpa}`

  useEffect(() => {
    if (!puedeEntrar || !carpa) return
    const unsub = suscribirPendientes(carpa, setPendientes)
    return unsub
  }, [puedeEntrar, carpa])

  useEffect(() => {
    if (!puedeEntrar || !carpa) return
    const unsub = suscribirCarpa(carpa, setVentas)
    return unsub
  }, [puedeEntrar, carpa])

  useEffect(() => {
    if (!puedeEntrar || !carpa) return
    const unsub = suscribirStockCarpa(carpa, setStock)
    return unsub
  }, [puedeEntrar, carpa])

  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoriaNombre))
    return ["todas", ...set]
  }, [productos])

  const productosFiltrados = useMemo(() => {
    const q = normalize(busqueda)
    return productos
      .filter((p) => {
        const tieneStockAqui = stock[p.idProducto] != null
        const coincideCategoria = categoria === "todas" || p.categoriaNombre === categoria
        const coincideBusqueda = !q || normalize(p.nombreProducto).includes(q)
        return tieneStockAqui && coincideCategoria && coincideBusqueda
      })
      .sort((a, b) => a.idProducto - b.idProducto)
  }, [productos, stock, busqueda, categoria])

  // Productos del catálogo que esta carpa todavía no ha agregado (sin stock asignado aquí).
  const productosSinAgregar = useMemo(() => {
    return productos
      .filter((p) => stock[p.idProducto] == null)
      .sort((a, b) => a.idProducto - b.idProducto)
  }, [productos, stock])

  const pendientesPorProducto = useMemo(() => {
    const mapa = {}
    pendientes.forEach((p) => { mapa[p.idProducto] = (mapa[p.idProducto] || 0) + p.cantidad })
    return mapa
  }, [pendientes])

  if (!carpa || !NOMBRES[carpa]) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }} className="flex items-center justify-center px-4">
        <p style={{ color: "rgba(212,168,67,0.6)" }}>Carpa no válida.</p>
      </div>
    )
  }

  if (cargando || !user || !puedeEntrar) {
    return (
      <EstadoAcceso
        cargando={cargando}
        user={user}
        autorizado={puedeEntrar}
        titulo={`${NOMBRES[carpa]} — Iniciar sesión`}
        emoji="⛺"
        mensajeDenegado={`Tu cuenta no tiene acceso a ${NOMBRES[carpa]}.`}
      />
    )
  }

  const total = productos.reduce((acc, p) => acc + (ventas[p.idProducto] || 0) * p.precio, 0)

  const iniciarEdicionStock = (idProducto) => {
    setEditandoStock(idProducto)
    setValorStock(stock[idProducto] ?? "")
  }

  const guardarStock = async (idProducto) => {
    const cantidad = valorStock === "" ? null : Number(valorStock)
    setEditandoStock(null)
    try {
      await establecerStock(carpa, idProducto, cantidad)
    } catch {
      toast.error("No se pudo guardar el stock")
    }
  }

  const disponiblePorProducto = (idProducto) => {
    const producto = productos.find((p) => String(p.idProducto) === String(idProducto))
    if (!producto) return 0
    const stockProducto = stock[producto.idProducto]
    if (stockProducto == null) return 0
    const vendido = ventas[producto.idProducto] || 0
    const enPendientes = pendientesPorProducto[producto.idProducto] || 0
    return stockProducto - vendido - enPendientes
  }

  const handleAgregarPendiente = async (e) => {
    e.preventDefault()
    const producto = productos.find((p) => String(p.idProducto) === String(formPendiente.idProducto))
    if (!formPendiente.nombreComprador.trim() || !producto || !formPendiente.cantidad) {
      toast.error("Falta el nombre, el producto o la cantidad")
      return
    }
    const disponible = disponiblePorProducto(producto.idProducto)
    if (Number(formPendiente.cantidad) > disponible) {
      toast.error(`Solo quedan ${disponible} disponibles de "${producto.nombreProducto}"`)
      return
    }
    setGuardandoPendiente(true)
    try {
      await crearPendiente(carpa, {
        nombreComprador: formPendiente.nombreComprador.trim(),
        idProducto: producto.idProducto,
        nombreProducto: producto.nombreProducto,
        cantidad: Number(formPendiente.cantidad),
        monto: Number(formPendiente.cantidad) * producto.precio,
      })
      setFormPendiente({ nombreComprador: "", idProducto: "", cantidad: 1 })
      toast.success("Pendiente agregado")
    } catch {
      toast.error("No se pudo guardar")
    } finally {
      setGuardandoPendiente(false)
    }
  }

  const handlePago = async (p) => {
    try {
      await marcarPendienteComoPagado(carpa, p)
      toast.success(`${p.nombreComprador} ya pagó`)
    } catch {
      toast.error("No se pudo marcar como pagado")
    }
  }

  const handleCancelarPendiente = async (p) => {
    if (!confirm(`¿Quitar el pendiente de ${p.nombreComprador}?`)) return
    try {
      await eliminarPendiente(carpa, p.id)
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  const totalPendiente = pendientes.reduce((acc, p) => acc + p.monto, 0)

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      {!online && (
        <div className="w-full py-2 px-4 text-center font-bold uppercase" style={{ background: "#8b0000", color: "#f5e6c8", fontSize: "12px", letterSpacing: "1px" }}>
          ⚠ Sin conexión — tus cambios se guardan en el celular y se enviarán solos cuando vuelva la señal
        </div>
      )}
      {/* Encabezado */}
      <div className="w-full py-8 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Link to="/inventario" style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>← INVENTARIO</Link>
        </div>
        <h1 className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "4px" }}>
          {NOMBRES[carpa]}
        </h1>
        <div className="inline-flex items-center gap-2 mt-4 px-6 py-2 rounded-full" style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.3)" }}>
          <span style={{ color: "rgba(212,168,67,0.6)", fontSize: "11px", letterSpacing: "1px" }}>TOTAL VENDIDO</span>
          <span className="font-black" style={{ color: "#f2c96e", fontSize: "20px", fontFamily: "'Arial Black', sans-serif" }}>
            ${total.toLocaleString("es-CO")}
          </span>
        </div>
        {totalPendiente > 0 && (
          <p className="mt-2" style={{ color: "#ffb450", fontSize: "11px" }}>
            + ${totalPendiente.toLocaleString("es-CO")} pendiente de pago
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        {/* Pendientes de pago */}
        <div className="mb-6 rounded-xl p-3" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(255,180,80,0.3)" }}>
          <button onClick={() => setVerPendientes((v) => !v)} className="text-xs font-bold uppercase w-full text-left flex items-center justify-between" style={{ color: "#ffb450", letterSpacing: "1px" }}>
            <span>{verPendientes ? "▲" : "▼"} 🕒 Pendientes de pago ({pendientes.length})</span>
            {totalPendiente > 0 && <span>${totalPendiente.toLocaleString("es-CO")}</span>}
          </button>

          {verPendientes && (
            <div className="mt-3 flex flex-col gap-3">
              {/* Formulario para agregar un pendiente */}
              <form onSubmit={handleAgregarPendiente} className="flex flex-col gap-2">
                <input
                  placeholder="Nombre de quien va a pagar después"
                  value={formPendiente.nombreComprador}
                  onChange={(e) => setFormPendiente({ ...formPendiente, nombreComprador: e.target.value })}
                  className="rounded-lg px-3 py-2 outline-none text-xs"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
                />
                <div className="flex gap-2">
                  <select
                    value={formPendiente.idProducto}
                    onChange={(e) => setFormPendiente({ ...formPendiente, idProducto: e.target.value })}
                    className="flex-1 rounded-lg px-3 py-2 outline-none text-xs"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
                  >
                    <option value="" style={{ background: "#1a0205" }}>Producto...</option>
                    {productosFiltrados.map((p) => {
                      const disp = disponiblePorProducto(p.idProducto)
                      return (
                        <option key={p.idProducto} value={p.idProducto} disabled={disp <= 0} style={{ background: "#1a0205", color: disp <= 0 ? "rgba(245,230,200,0.3)" : "#f5e6c8" }}>
                          {p.nombreProducto} (${p.precio.toLocaleString("es-CO")}) · quedan {disp}
                        </option>
                      )
                    })}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={formPendiente.cantidad}
                    onChange={(e) => setFormPendiente({ ...formPendiente, cantidad: e.target.value })}
                    className="w-16 rounded-lg px-2 py-2 outline-none text-xs text-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={guardandoPendiente}
                  className="rounded-lg py-2 font-black uppercase text-xs disabled:opacity-50"
                  style={{ background: "#ffb450", color: "#1a0205", letterSpacing: "1px" }}
                >
                  Anotar pendiente
                </button>
              </form>

              {/* Lista de pendientes */}
              {pendientes.length === 0 ? (
                <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "12px" }}>Nadie debe nada por ahora.</p>
              ) : (
                <div className="flex flex-col gap-2" style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {pendientes.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(255,180,80,0.06)", border: "1px solid rgba(255,180,80,0.2)" }}>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate" style={{ color: "#ffb450", fontSize: "12px" }}>{p.nombreComprador}</p>
                        <p style={{ color: "rgba(245,230,200,0.6)", fontSize: "11px" }}>
                          {p.cantidad}× {p.nombreProducto} · ${p.monto.toLocaleString("es-CO")}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handlePago(p)} className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: "#8fd694", color: "#0a1a0a" }}>Ya pagó</button>
                        <button onClick={() => handleCancelarPendiente(p)} className="text-xs font-bold px-2 py-1 rounded-lg" style={{ border: "1px solid rgba(255,100,100,0.4)", color: "#ff8080" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* Agregar productos del catálogo a esta carpa */}
        {!cargandoProductos && (
          <div className="mb-6 rounded-xl p-3" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}>
            <button onClick={() => setVerAgregar((v) => !v)} className="text-xs font-bold uppercase w-full text-left" style={{ color: "#d4a843", letterSpacing: "1px" }}>
              {verAgregar ? "▲" : "▼"} Agregar productos a esta carpa ({productosSinAgregar.length})
            </button>
            {verAgregar && (
              <div className="mt-3 flex flex-col gap-2" style={{ maxHeight: "260px", overflowY: "auto" }}>
                {productosSinAgregar.length === 0 ? (
                  <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "12px" }}>Ya agregaste todo el catálogo a esta carpa.</p>
                ) : (
                  productosSinAgregar.map((p) => (
                    <div key={p.idProducto} className="flex items-center justify-between gap-3 py-1" style={{ borderBottom: "1px solid rgba(212,168,67,0.08)" }}>
                      <span style={{ color: "rgba(245,230,200,0.8)", fontSize: "12px" }}>{p.nombreProducto}</span>
                      {editandoStock === p.idProducto ? (
                        <input
                          type="number"
                          autoFocus
                          value={valorStock}
                          onChange={(e) => setValorStock(e.target.value)}
                          onBlur={() => guardarStock(p.idProducto)}
                          onKeyDown={(e) => e.key === "Enter" && guardarStock(p.idProducto)}
                          placeholder="Stock"
                          className="w-20 rounded px-2 py-1 text-xs outline-none flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(212,168,67,0.4)", color: "#f5e6c8" }}
                        />
                      ) : (
                        <button
                          onClick={() => iniciarEdicionStock(p.idProducto)}
                          className="text-xs font-bold px-3 py-1 rounded-lg flex-shrink-0"
                          style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}
                        >
                          + Agregar
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Lista de productos */}
        {cargandoProductos ? (
          <p className="text-center py-16" style={{ color: "rgba(212,168,67,0.4)" }}>Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <p className="text-center py-16" style={{ color: "rgba(212,168,67,0.4)" }}>
            {productos.length === 0 ? "No se encontraron productos." : "Todavía no has agregado productos a esta carpa."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {productosFiltrados.map((p) => {
              const cantidad = ventas[p.idProducto] || 0
              const subtotal = cantidad * p.precio
              const stockProducto = stock[p.idProducto]
              const tieneStock = stockProducto != null
              const restante = tieneStock ? stockProducto - cantidad - (pendientesPorProducto[p.idProducto] || 0) : null
              const agotado = tieneStock && restante <= 0
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
                      <span style={{ fontSize: "24px" }}>{getEmojiCategoria(p.categoriaNombre, getCategoriaById(categoriasFirestore, p.idCategoria)?.icono)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold truncate" style={{ color: "white", fontSize: "13px" }}>{p.nombreProducto}</p>
                    <p style={{ color: "#d4a843", fontSize: "14px", fontWeight: "800" }}>${p.precio.toLocaleString("es-CO")}</p>
                    {editandoStock === p.idProducto ? (
                      <input
                        type="number"
                        autoFocus
                        value={valorStock}
                        onChange={(e) => setValorStock(e.target.value)}
                        onBlur={() => guardarStock(p.idProducto)}
                        onKeyDown={(e) => e.key === "Enter" && guardarStock(p.idProducto)}
                        placeholder="Stock en esta carpa"
                        className="mt-1 w-28 rounded px-2 py-1 text-xs outline-none"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(212,168,67,0.4)", color: "#f5e6c8" }}
                      />
                    ) : (
                      <button
                        onClick={() => iniciarEdicionStock(p.idProducto)}
                        style={{ color: agotado ? "#ff9b9b" : "rgba(212,168,67,0.4)", fontSize: "10px", fontWeight: agotado ? "700" : "400" }}
                      >
                        {tieneStock ? (agotado ? "Agotado · editar" : `Quedan: ${restante} · editar`) : "Definir stock en esta carpa"}
                      </button>
                    )}
                    {cantidad > 0 && <p style={{ color: "rgba(212,168,67,0.5)", fontSize: "11px" }}>Subtotal: ${subtotal.toLocaleString("es-CO")}</p>}
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
                      disabled={agotado}
                      className="w-9 h-9 rounded-lg font-black text-lg disabled:opacity-20"
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