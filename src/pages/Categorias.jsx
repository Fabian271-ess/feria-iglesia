import { useNavigate } from "react-router-dom"
import { useCategorias } from "../context/CategoriasContext"
import { getCategoriasSinPadre, getSubcategorias, normalizeSlug, getEmojiCategoria } from "../lib/categoriaHelpers"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

export default function Categorias() {
  const navigate = useNavigate()
  const { categorias, loading } = useCategorias()
  const secciones = getCategoriasSinPadre(categorias)

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-12 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "6px" }}>NAVEGA POR</p>
        <h1 className="font-black uppercase mt-2" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 48px)", letterSpacing: "6px" }}>
          Categorías
        </h1>
        <div className="w-16 h-px mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {loading ? (
          <p className="text-center" style={{ color: "rgba(212,168,67,0.4)" }}>Cargando categorías...</p>
        ) : secciones.length === 0 ? (
          <p className="text-center" style={{ color: "rgba(212,168,67,0.4)" }}>Todavía no hay categorías.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {secciones.map((sec) => {
              const hijas = getSubcategorias(categorias, sec.idCategoria)
              return (
                <div key={sec.idCategoria}>
                  <button
                    onClick={() => navigate(`/catalogo/${normalizeSlug(sec.nombre)}`)}
                    className="flex items-center gap-3 mb-5"
                  >
                    <span style={{ fontSize: "32px" }}>{getEmojiCategoria(sec.nombre, sec.icono)}</span>
                    <span className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", letterSpacing: "3px" }}>
                      {sec.nombre}
                    </span>
                  </button>
                  {hijas.length === 0 ? (
                    <p style={{ color: "rgba(212,168,67,0.35)", fontSize: "13px" }}>Sin categorías todavía.</p>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {hijas.map((cat) => (
                        <button
                          key={cat.idCategoria}
                          onClick={() => navigate(`/catalogo/${normalizeSlug(sec.nombre)}/${normalizeSlug(cat.nombre)}`)}
                          className="flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-2xl transition-all duration-300 active:scale-95"
                          style={{ background: "rgba(26,2,5,0.85)", border: "1px solid rgba(212,168,67,0.2)", width: "clamp(140px, 24vw, 200px)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #d4a843"; e.currentTarget.style.background = "rgba(212,168,67,0.06)" }}
                          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.background = "rgba(26,2,5,0.85)" }}
                        >
                          <span style={{ fontSize: "34px" }}>{getEmojiCategoria(cat.nombre, cat.icono)}</span>
                          <span className="font-black uppercase text-center" style={{ color: "#d4a843", letterSpacing: "1px", fontSize: "12px", fontFamily: "'Arial Black', sans-serif" }}>
                            {cat.nombre}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
