import { Link } from "react-router-dom"
import logoFeria from "../assets/logo-feria.png"
import { useCategorias } from "../context/CategoriasContext"
import { getCategoriasSinPadre, normalizeSlug } from "../lib/categoriaHelpers"

export default function Footer() {
  const { categorias } = useCategorias()
  const secciones = getCategoriasSinPadre(categorias).map((c) => ({
    nombre: c.nombre,
    ruta: `/catalogo/${normalizeSlug(c.nombre)}`,
  }))

  return (
    <footer style={{ background: "#100103", borderTop: "1px solid rgba(212,168,67,0.25)" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Marca */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 select-none w-fit">
              <img src={logoFeria} alt="Feria Corazones Fuertes" style={{ height: "56px", objectFit: "contain" }} />
              <div className="flex flex-col leading-none">
                <span className="font-black uppercase" style={{ color: "#d4a843", letterSpacing: "3px", fontSize: "13px", fontFamily: "'Arial Black', sans-serif" }}>Feria</span>
                <span className="font-black uppercase" style={{ color: "#f5e6c8", letterSpacing: "2px", fontSize: "10px" }}>Corazones Fuertes</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(212,168,67,0.45)", maxWidth: "260px" }}>
              Adolescentes IPUC Pisarreal 2026 · Feria con propósito, ¡Dios te bendiga!
            </p>
          </div>

          {/* Secciones */}
          {secciones.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 style={{ color: "#d4a843", fontSize: "11px", letterSpacing: "4px" }}>SECCIONES</h4>
              <ul className="flex flex-col gap-2">
                {secciones.map((sec) => (
                  <li key={sec.nombre}>
                    <Link to={sec.ruta} style={{ color: "rgba(212,168,67,0.5)", fontSize: "13px" }}>{sec.nombre}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid rgba(212,168,67,0.15)", marginTop: "32px", paddingTop: "24px" }} className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p style={{ color: "rgba(212,168,67,0.7)", fontSize: "11px", letterSpacing: "2px" }}>2026 Feria Corazones Fuertes · IPUC Pisarreal</p>
          <p style={{ color: "rgba(212,168,67,0.7)", fontSize: "11px" }}>Hecho en Colombia 🇨🇴</p>
          <p style={{ color: "rgba(212,168,67,0.7)", fontSize: "11px" }}>Desarrollado por Fabian Hoyos</p>
        </div>
      </div>
    </footer>
  )
}
