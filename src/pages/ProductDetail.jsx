import { useNavigate, useParams } from "react-router-dom"
import { getProductoById, getProductosByCategoria } from "../data/productos"

const EMOJIS = {
  "accesorios de cabello": "🎀", "construcción": "🪴", "repostería": "🍫",
  "moñas": "🎀", "corbatas": "🎗️", "diademas": "👑",
  "chocomensajes": "💌", "chocolates sueltos": "🍫", "rositas": "🌸",
  "corazones": "❤️", "macetas pequeñas": "🪴", "macetas medianas": "🌿", "macetas grandes": "🌳",
}
const getEmoji = (nombre) => EMOJIS[nombre?.toLowerCase()] || "🛍️"

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const producto = getProductoById(id)
  const relacionados = producto
    ? getProductosByCategoria(producto.idCategoria).filter((p) => p.idProducto !== producto.idProducto).slice(0, 4)
    : []

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a0205" }}>
        <div className="text-center">
          <p style={{ color: "rgba(212,168,67,0.5)", fontSize: "18px" }}>Producto no encontrado</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 rounded-lg font-black uppercase"
            style={{ background: "linear-gradient(90deg, #6b0f1a, #d4a843, #6b0f1a)", color: "#1a0205", letterSpacing: "2px" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const whatsappMsg = encodeURIComponent(
    `¡Hola! Me interesa el producto *${producto.nombreProducto}* ($${Number(producto.precio).toLocaleString()} COP) de la Feria Corazones Fuertes. ¿Está disponible?`
  )

  return (
    <div style={{ background: "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate("/")} style={{ color: "rgba(212,168,67,0.45)", fontSize: "11px", letterSpacing: "2px" }}>INICIO</button>
          <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
          <button onClick={() => navigate(-1)} style={{ color: "rgba(212,168,67,0.45)", fontSize: "11px", letterSpacing: "2px" }}>
            {producto.categoriaNombre?.toUpperCase()}
          </button>
          <span style={{ color: "rgba(212,168,67,0.25)" }}>{">"}</span>
          <span style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "2px" }}>{producto.nombreProducto?.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Imagen */}
          <div
            className="relative rounded-xl flex items-center justify-center overflow-hidden"
            style={{ height: "420px", background: "rgba(139,0,0,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}
          >
            {producto.imagenUrl ? (
              <img src={producto.imagenUrl} alt={producto.nombreProducto} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />
            ) : (
              <span style={{ fontSize: "120px" }}>{getEmoji(producto.categoriaNombre)}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "4px" }}>FERIA CORAZONES FUERTES</p>
              <h1 className="font-black uppercase mt-1" style={{ color: "white", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(22px, 4vw, 32px)", lineHeight: "1.1" }}>
                {producto.nombreProducto}
              </h1>
              <p className="font-black mt-3" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "28px" }}>
                ${Number(producto.precio).toLocaleString()} COP
              </p>
            </div>

            <div className="w-full h-px" style={{ background: "rgba(212,168,67,0.15)" }} />

            {producto.descripcion && (
              <p style={{ color: "rgba(212,168,67,0.6)", fontSize: "14px", lineHeight: "1.8" }}>
                {producto.descripcion}
              </p>
            )}

            {/* CTA WhatsApp */}
            <div className="flex flex-col gap-3 mt-2">
              <a
                href={`https://wa.me/573108145520?text=${whatsappMsg}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-lg font-black uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(90deg, #128c3b, #25D366)", color: "white", letterSpacing: "2px", fontFamily: "'Arial Black', sans-serif", fontSize: "14px" }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Pedir por WhatsApp
              </a>
              <button
                onClick={() => navigate(-1)}
                className="w-full py-4 rounded-lg font-black uppercase transition-all duration-200 active:scale-95"
                style={{ border: "1px solid rgba(212,168,67,0.3)", color: "rgba(212,168,67,0.6)", letterSpacing: "3px", fontFamily: "'Arial Black', sans-serif", fontSize: "14px", background: "transparent" }}
              >
                Seguir viendo
              </button>
            </div>
          </div>
        </div>

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="font-black uppercase mb-6" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "20px", letterSpacing: "4px" }}>
              También te puede gustar
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relacionados.map((p) => (
                <div
                  key={p.idProducto}
                  className="flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.2)" }}
                  onClick={() => navigate(`/producto/${p.idProducto}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.6)"; e.currentTarget.style.transform = "translateY(-4px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(212,168,67,0.2)"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  <div className="w-full flex items-center justify-center overflow-hidden" style={{ height: "140px", background: "rgba(139,0,0,0.08)" }}>
                    {p.imagenUrl ? (
                      <img src={p.imagenUrl} alt={p.nombreProducto} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ fontSize: "52px" }}>{getEmoji(p.categoriaNombre)}</span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <p className="font-black uppercase" style={{ color: "white", fontSize: "11px", fontFamily: "'Arial Black', sans-serif" }}>
                      {p.nombreProducto}
                    </p>
                    <p className="font-black" style={{ color: "#d4a843", fontSize: "14px", fontFamily: "'Arial Black', sans-serif" }}>
                      ${Number(p.precio).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
