import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useProductos } from "../context/ProductosContext"
import { useCategorias } from "../context/CategoriasContext"
import { getCategoriaById, getEmojiCategoria } from "../lib/categoriaHelpers"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export default function Productos() {
  const navigate = useNavigate()
  const { productos, loading } = useProductos()
  const { categorias } = useCategorias()
  const [busqueda, setBusqueda] = useState("")

  const productosOrdenados = useMemo(() => {
    const q = normalize(busqueda)
    return [...productos]
      .filter((p) => p.activo !== false)
      .filter((p) => !q || normalize(p.nombreProducto).includes(q) || normalize(p.categoriaNombre).includes(q))
      .sort((a, b) => a.precio - b.precio)
  }, [productos, busqueda])

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "6px" }}>TODO EL CATÁLOGO</p>
        <h1 className="font-black uppercase mt-2" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "6px" }}>
          Productos
        </h1>
        <div className="w-16 h-px mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />

        <div className="max-w-md mx-auto mt-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar producto..."
            className="w-full rounded-xl px-4 py-3 outline-none"
            style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8", fontSize: "14px" }}
          />
        </div>

        {!loading && (
          <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "13px", marginTop: "12px" }}>
            {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? "s" : ""} · de menor a mayor precio
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <p style={{ fontSize: "48px" }}>⏳</p>
            <p className="mt-4" style={{ color: "rgba(212,168,67,0.4)", fontSize: "16px" }}>Cargando productos...</p>
          </div>
        ) : productosOrdenados.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ fontSize: "48px" }}>🛍️</p>
            <p className="mt-4" style={{ color: "rgba(212,168,67,0.4)", fontSize: "16px" }}>
              {busqueda ? "No se encontraron productos con ese nombre." : "Todavía no hay productos."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productosOrdenados.map((producto) => (
              <div
                key={producto.idProducto}
                className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}
                onClick={() => navigate(`/producto/${producto.idProducto}`)}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.6)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                <div className="relative w-full flex items-center justify-center" style={{ height: "160px", background: "rgba(139,0,0,0.08)" }}>
                  {producto.imagenUrl ? (
                    <img src={producto.imagenUrl} alt={producto.nombreProducto} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />
                  ) : (
                    <span style={{ fontSize: "56px" }}>{getEmojiCategoria(producto.categoriaNombre, getCategoriaById(categorias, producto.idCategoria)?.icono)}</span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p className="font-black uppercase leading-tight" style={{ color: "white", fontSize: "13px", fontFamily: "'Arial Black', sans-serif" }}>
                    {producto.nombreProducto}
                  </p>
                  <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "10px", letterSpacing: "1px" }}>
                    {producto.categoriaNombre?.toUpperCase()}
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
  )
}