import { useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  categorias,
  getCategoriasSinPadre,
  getSubcategorias,
  getProductosByCategoria,
} from "../data/productos"

const EMOJIS = {
  "accesorios de cabello": "🎀", "construcción": "🪴", "chocolatería": "🍫",
  "moñas": "🎀", "moña scrunchie": "🪢", "diademas": "👑",
  "chocomensajes": "💌", "chocolates sueltos": "🍫", "rositas": "🌸",
  "corazones": "❤️", "macetas pequeñas": "🪴", "macetas medianas": "🌿", "macetas grandes": "🌳",
}
const getEmoji = (nombre) => EMOJIS[nombre?.toLowerCase()] || "🛍️"

const normalize = (str) =>
  str?.toLowerCase()
    .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú|ü/g, "u")
    .replace(/ /g, "-")

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

export default function Catalog() {
  const { seccion, subseccion } = useParams()
  const navigate = useNavigate()
  const [ordenar, setOrdenar]   = useState("default")
  const [precioMax, setPrecioMax] = useState(100000)

  const secciones      = getCategoriasSinPadre()
  const seccionActiva  = secciones.find((c) => normalize(c.nombre) === seccion)
  const subcategorias  = seccionActiva ? getSubcategorias(seccionActiva.idCategoria) : []
  const subcategoriaActiva = subcategorias.find((c) => normalize(c.nombre) === subseccion)

  const productosBase = useMemo(() => {
    if (!seccion) return []
    if (seccion && !subseccion && subcategorias.length > 0) return []
    const catId = subcategoriaActiva?.idCategoria || seccionActiva?.idCategoria
    return catId ? getProductosByCategoria(catId) : []
  }, [seccion, subseccion, seccionActiva, subcategoriaActiva, subcategorias.length])

  const productosFiltrados = useMemo(() => {
    let r = productosBase.filter((p) => p.precio <= precioMax)
    if (ordenar === "menor") r = [...r].sort((a, b) => a.precio - b.precio)
    if (ordenar === "mayor") r = [...r].sort((a, b) => b.precio - a.precio)
    return r
  }, [productosBase, precioMax, ordenar])

  // ── Pantalla 1: Secciones principales ──
  if (!seccion) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }}>
        <div className="w-full py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
          <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "6px" }}>NAVEGA POR</p>
          <h1 className="font-black uppercase mt-2" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "6px" }}>
            Secciones
          </h1>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secciones.map((sec) => (
              <button
                key={sec.idCategoria}
                onClick={() => navigate(`/catalogo/${normalize(sec.nombre)}`)}
                className="flex flex-col items-center justify-center gap-4 py-14 px-6 rounded-2xl transition-all duration-300 active:scale-95"
                style={{ background: "rgba(26,2,5,0.85)", border: "1px solid rgba(212,168,67,0.2)" }}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #d4a843"; e.currentTarget.style.background = "rgba(212,168,67,0.06)" }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.background = "rgba(26,2,5,0.85)" }}
              >
                <span style={{ fontSize: "56px" }}>{getEmoji(sec.nombre)}</span>
                <span className="font-black uppercase" style={{ color: "#d4a843", letterSpacing: "2px", fontSize: "14px", fontFamily: "'Arial Black', sans-serif" }}>
                  {sec.nombre}
                </span>
                {sec.descripcion && (
                  <span style={{ color: "rgba(212,168,67,0.5)", fontSize: "12px", lineHeight: "1.6", textAlign: "center" }}>
                    {sec.descripcion}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Pantalla 2: Subcategorías ──
  if (seccion && !subseccion && subcategorias.length > 0) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }}>
        <div className="w-full py-10 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <button onClick={() => navigate("/")} style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>INICIO</button>
            <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
            <button onClick={() => navigate("/catalogo")} style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>SECCIONES</button>
            <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
            <span style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "2px" }}>{seccionActiva?.nombre.toUpperCase()}</span>
          </div>
          <h1 className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "4px" }}>
            {seccionActiva?.nombre}
          </h1>
          <div className="w-16 h-px mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-wrap justify-center gap-5">
            {subcategorias.map((sub) => (
              <button
                key={sub.idCategoria}
                onClick={() => navigate(`/catalogo/${seccion}/${normalize(sub.nombre)}`)}
                className="flex flex-col items-center justify-center gap-3 py-12 px-4 rounded-2xl transition-all duration-300 active:scale-95"
                style={{
                  background: "rgba(26,2,5,0.85)",
                  border: "1px solid rgba(212,168,67,0.2)",
                  width: "clamp(160px, 28vw, 260px)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #d4a843"; e.currentTarget.style.background = "rgba(212,168,67,0.06)" }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.background = "rgba(26,2,5,0.85)" }}
              >
                <span style={{ fontSize: "44px" }}>{getEmoji(sub.nombre)}</span>
                <span className="font-black uppercase" style={{ color: "#d4a843", letterSpacing: "2px", fontSize: "13px", fontFamily: "'Arial Black', sans-serif" }}>
                  {sub.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Pantalla 3: Productos ──
  const nombreActual = subcategoriaActiva?.nombre || seccionActiva?.nombre || seccion

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-10 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
          <button onClick={() => navigate("/")} style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>INICIO</button>
          <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
          <button onClick={() => navigate("/catalogo")} style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>SECCIONES</button>
          {seccionActiva && (
            <>
              <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
              <button onClick={() => navigate(`/catalogo/${seccion}`)} style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>
                {seccionActiva.nombre.toUpperCase()}
              </button>
            </>
          )}
          {subcategoriaActiva && (
            <>
              <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
              <span style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "2px" }}>{subcategoriaActiva.nombre.toUpperCase()}</span>
            </>
          )}
        </div>
        <h1 className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "6px" }}>
          {nombreActual}
        </h1>
        <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "13px", marginTop: "6px" }}>
          {productosFiltrados.length} productos encontrados
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 pb-20">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros */}
          <div className="md:w-52 flex-shrink-0 flex flex-col gap-4">
            <div className="p-4 rounded-xl flex flex-col gap-3" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}>
              <h3 className="font-black uppercase" style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "3px" }}>Ordenar por</h3>
              {[{ valor: "default", label: "Novedades" }, { valor: "menor", label: "Menor precio" }, { valor: "mayor", label: "Mayor precio" }].map((op) => (
                <button key={op.valor} onClick={() => setOrdenar(op.valor)} className="text-left text-sm py-1 font-semibold"
                  style={{ color: ordenar === op.valor ? "#d4a843" : "rgba(212,168,67,0.4)" }}>
                  {ordenar === op.valor ? "▶ " : ""}{op.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl flex flex-col gap-3" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}>
              <h3 className="font-black uppercase" style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "3px" }}>Precio máximo</h3>
              <input type="range" min="1000" max="100000" step="1000" value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="w-full" style={{ accentColor: "#d4a843" }} />
              <p style={{ color: "#d4a843", fontSize: "13px", fontWeight: "700" }}>
                Hasta ${precioMax.toLocaleString()} COP
              </p>
            </div>

            {subcategorias.length > 0 && (
              <div className="p-4 rounded-xl flex flex-col gap-2" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}>
                <h3 className="font-black uppercase mb-1" style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "3px" }}>Tipo</h3>
                {subcategorias.map((sub) => (
                  <button key={sub.idCategoria}
                    onClick={() => navigate(`/catalogo/${seccion}/${normalize(sub.nombre)}`)}
                    className="text-center text-sm py-1 font-semibold w-full"
                    style={{ color: sub.idCategoria === subcategoriaActiva?.idCategoria ? "#d4a843" : "rgba(212,168,67,0.4)" }}>
                    {sub.idCategoria === subcategoriaActiva?.idCategoria ? "▶ " : ""}{sub.nombre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="flex-1">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-20">
                <p style={{ fontSize: "48px" }}>🛍️</p>
                <p className="mt-4" style={{ color: "rgba(212,168,67,0.4)", fontSize: "16px" }}>
                  No hay productos en esta categoría aún
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.idProducto}
                    className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
                    style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}
                    onClick={() => navigate(`/producto/${producto.idProducto}`)}
                    onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.6)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.transform = "translateY(0)" }}
                  >
                    <div className="relative w-full flex items-center justify-center" style={{ height: "180px", background: "rgba(139,0,0,0.08)" }}>
                      {producto.imagenUrl ? (
                        <img src={producto.imagenUrl} alt={producto.nombreProducto} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />
                      ) : (
                        <span style={{ fontSize: "64px" }}>{getEmoji(producto.categoriaNombre)}</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <p className="font-black uppercase leading-tight" style={{ color: "white", fontSize: "13px", fontFamily: "'Arial Black', sans-serif" }}>
                        {producto.nombreProducto}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-black" style={{ color: "#d4a843", fontSize: "16px", fontFamily: "'Arial Black', sans-serif" }}>
                          ${Number(producto.precio).toLocaleString()}
                        </span>
                        <span style={{ color: "rgba(212,168,67,0.4)", fontSize: "10px", letterSpacing: "1px" }}>VER →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}