import { useNavigate, useSearchParams } from "react-router-dom"
import { buscarProductos } from "../data/productos"

const EMOJIS = {
  "accesorios de cabello": "🎀", "construcción": "🪴", "repostería": "🍫",
  "moñas": "🎀", "corbatas": "🎗️", "diademas": "👑",
  "chocomensajes": "💌", "chocolates sueltos": "🍫", "rositas": "🌸",
  "corazones": "❤️", "macetas pequeñas": "🪴", "macetas medianas": "🌿", "macetas grandes": "🌳",
}
const getEmoji = (nombre) => EMOJIS[nombre?.toLowerCase()] || "🛍️"

export default function Busqueda() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const resultados = buscarProductos(query)

  return (
    <div style={{ background: "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "4px" }}>RESULTADOS PARA</p>
          <h1 className="font-black uppercase mt-1" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "32px", letterSpacing: "4px" }}>
            "{query}"
          </h1>
          <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "13px", marginTop: "4px" }}>
            {resultados.length} producto{resultados.length !== 1 ? "s" : ""} encontrado{resultados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {resultados.length === 0 ? (
          <div className="text-center py-20">
            <span style={{ fontSize: "64px" }}>🔍</span>
            <p className="mt-4" style={{ color: "rgba(212,168,67,0.4)", fontSize: "16px" }}>
              No encontramos productos para "{query}"
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-8 py-3 rounded-lg font-black uppercase text-xs"
              style={{ background: "linear-gradient(90deg, #6b0f1a, #d4a843, #6b0f1a)", color: "#1a0205", letterSpacing: "3px" }}
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {resultados.map((producto) => (
              <div
                key={producto.idProducto}
                className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}
                onClick={() => navigate(`/producto/${producto.idProducto}`)}
                onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.6)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: "160px", background: "rgba(139,0,0,0.08)" }}>
                  {producto.imagenUrl ? (
                    <img src={producto.imagenUrl} alt={producto.nombreProducto} className="w-full h-full object-cover" />
                  ) : (
                    <span style={{ fontSize: "56px" }}>{getEmoji(producto.categoriaNombre)}</span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p className="font-black uppercase" style={{ color: "white", fontSize: "12px", fontFamily: "'Arial Black', sans-serif" }}>
                    {producto.nombreProducto}
                  </p>
                  <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "10px", letterSpacing: "2px" }}>
                    {producto.categoriaNombre?.toUpperCase()}
                  </p>
                  <p className="font-black" style={{ color: "#d4a843", fontSize: "15px", fontFamily: "'Arial Black', sans-serif" }}>
                    ${Number(producto.precio).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
