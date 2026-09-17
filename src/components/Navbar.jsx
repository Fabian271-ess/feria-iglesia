import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logoFeria from "../assets/logo-feria.png"
import { useAuthUser } from "../lib/useAuthUser"
import { useCerrarSesion } from "../lib/useCerrarSesion"
import LoginModal from "./LoginModal"
import Icono from "./Icono"

const SECCIONES_MENU = [
  { nombre: "Productos", ruta: "/productos" },
  { nombre: "Categorías", ruta: "/categorias" },
]

export default function Navbar() {
  const [menuAbierto, setMenuAbierto]         = useState(false)
  const [busqueda, setBusqueda]               = useState("")
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false)
  const [loginAbierto, setLoginAbierto]       = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthUser()
  const cerrarSesion = useCerrarSesion()

  const handleBusqueda = (e) => {
    e.preventDefault()
    if (busqueda.trim()) {
      navigate(`/busqueda?q=${busqueda}`)
      setBusqueda("")
      setMostrarBusqueda(false)
      setMenuAbierto(false)
    }
  }

  const handleLoginExitoso = () => {
    setLoginAbierto(false)
    setMenuAbierto(false)
    navigate("/inventario")
  }

  return (
    <>
    <header
      className="w-full sticky top-0 z-50"
      style={{ background: "rgba(26,2,5,0.97)", borderBottom: "1px solid rgba(212,168,67,0.35)", backdropFilter: "blur(10px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none flex-shrink-0">
          <img src={logoFeria} alt="Feria Corazones Fuertes" style={{ height: "52px", objectFit: "contain" }} />
          <div className="flex flex-col leading-none">
            <span className="font-black uppercase" style={{ color: "#d4a843", letterSpacing: "3px", fontSize: "13px", fontFamily: "'Arial Black', sans-serif" }}>Feria</span>
            <span className="font-black uppercase" style={{ color: "#f5e6c8", letterSpacing: "2px", fontSize: "10px" }}>Corazones Fuertes</span>
          </div>
        </Link>

        {/* Secciones desktop */}
        <nav className="hidden md:flex items-center gap-5">
          {SECCIONES_MENU.map((sec) => (
            <Link
              key={sec.nombre}
              to={sec.ruta}
              className="text-sm font-bold uppercase transition-colors duration-200"
              style={{ color: "rgba(212,168,67,0.65)", letterSpacing: "1px" }}
              onMouseEnter={(e) => (e.target.style.color = "#d4a843")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(212,168,67,0.65)")}
            >
              {sec.nombre}
            </Link>
          ))}
        </nav>

        {/* Acciones desktop */}
        <div className="flex items-center gap-3">
          {mostrarBusqueda && (
            <form onSubmit={handleBusqueda} className="hidden md:flex">
              <input
                autoFocus
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="px-4 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.4)", color: "#f5e6c8", width: "200px" }}
                onBlur={() => { if (!busqueda) setMostrarBusqueda(false) }}
              />
            </form>
          )}

          <button
            onClick={() => setMostrarBusqueda(!mostrarBusqueda)}
            className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center transition-all duration-200"
            style={{ border: "1px solid rgba(212,168,67,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4a843")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)")}
          >
            <Icono nombre="search" style={{ color: "#d4a843" }} />
          </button>

          {user ? (
            <>
              <Link
                to="/inventario"
                title="Inventario"
                className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center transition-all duration-200"
                style={{ border: "1px solid rgba(212,168,67,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4a843")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)")}
              >
                <Icono nombre="inventory_2" style={{ color: "#d4a843" }} />
              </Link>
              <button
                onClick={cerrarSesion}
                title="Cerrar sesión"
                className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center transition-all duration-200"
                style={{ border: "1px solid rgba(212,168,67,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4a843")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)")}
              >
                <Icono nombre="logout" style={{ color: "#d4a843" }} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setLoginAbierto(true)}
              title="Iniciar sesión"
              className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center transition-all duration-200"
              style={{ border: "1px solid rgba(212,168,67,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#d4a843")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)")}
            >
              <Icono nombre="login" style={{ color: "#d4a843" }} />
            </button>
          )}

          {/* Hamburguesa mobile */}
          <button className="md:hidden flex flex-col gap-1 p-2" onClick={() => setMenuAbierto(!menuAbierto)}>
            <span className="block w-5 h-0.5" style={{ background: "#d4a843" }} />
            <span className="block w-5 h-0.5" style={{ background: "#d4a843" }} />
            <span className="block w-5 h-0.5" style={{ background: "#d4a843" }} />
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-3" style={{ borderTop: "1px solid rgba(212,168,67,0.15)" }}>
          <form onSubmit={handleBusqueda} className="mt-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.3)", color: "#f5e6c8" }}
            />
          </form>
          {SECCIONES_MENU.map((sec) => (
            <Link
              key={sec.nombre}
              to={sec.ruta}
              onClick={() => setMenuAbierto(false)}
              className="text-sm font-bold uppercase py-2"
              style={{ color: "rgba(212,168,67,0.65)", letterSpacing: "2px", borderBottom: "1px solid rgba(212,168,67,0.1)" }}
            >
              {sec.nombre}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/inventario"
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-2 text-sm font-bold uppercase py-2"
                style={{ color: "rgba(212,168,67,0.65)", letterSpacing: "2px", borderBottom: "1px solid rgba(212,168,67,0.1)" }}
              >
                <Icono nombre="inventory_2" /> Inventario
              </Link>
              <button
                onClick={() => { cerrarSesion(); setMenuAbierto(false) }}
                className="flex items-center gap-2 text-sm font-bold uppercase py-2 text-left"
                style={{ color: "rgba(212,168,67,0.65)", letterSpacing: "2px", borderBottom: "1px solid rgba(212,168,67,0.1)" }}
              >
                <Icono nombre="logout" /> Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => setLoginAbierto(true)}
              className="flex items-center gap-2 text-sm font-bold uppercase py-2 text-left"
              style={{ color: "rgba(212,168,67,0.65)", letterSpacing: "2px", borderBottom: "1px solid rgba(212,168,67,0.1)" }}
            >
              <Icono nombre="login" /> Iniciar sesión
            </button>
          )}
        </div>
      )}
    </header>
    <LoginModal abierto={loginAbierto} onClose={() => setLoginAbierto(false)} onSuccess={handleLoginExitoso} />
    </>
  )
}
