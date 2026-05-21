import { Link } from "react-router-dom"
import logoFeria from "../assets/logo-feria.png"

const secciones = [
  { nombre: "Accesorios de Cabello", ruta: "/catalogo/accesorios-de-cabello" },
  { nombre: "Construcción",          ruta: "/catalogo/construccion" },
  { nombre: "Chocolatería",          ruta: "/catalogo/chocolateria" },
]

export default function Footer() {
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
            <a
              href="https://wa.me/573108145520"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 w-fit px-4 py-2 rounded-lg transition-all duration-200"
              style={{ border: "1px solid rgba(37,211,102,0.35)", color: "#25D366", fontSize: "13px", fontWeight: "700" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#25D366")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(37,211,102,0.35)")}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              +57 310 8145520
            </a>
          </div>

          {/* Secciones */}
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
        </div>

        <div style={{ borderTop: "1px solid rgba(212,168,67,0.15)", marginTop: "32px", paddingTop: "24px" }} className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p style={{ color: "rgba(212,168,67,0.3)", fontSize: "11px", letterSpacing: "2px" }}>2026 Feria Corazones Fuertes · IPUC Pisarreal</p>
          <p style={{ color: "rgba(212,168,67,0.2)", fontSize: "11px" }}>Hecho en Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  )
}
