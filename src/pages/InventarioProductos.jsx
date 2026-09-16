import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useProductos } from "../context/ProductosContext"
import { useAuthUser } from "../lib/useAuthUser"
import { cerrarSesion } from "../lib/auth"
import LoginForm from "../components/LoginForm"
import { categorias } from "../data/categorias"
import { crearProducto, actualizarProducto, eliminarProducto, migrarProductosSemilla } from "../lib/productosFirestore"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"
const categoriasHoja = categorias.filter((c) => c.idPadre) // solo las de hasta abajo, donde van los productos

const formVacio = { nombreProducto: "", precio: "", idCategoria: "", imagenUrl: "", descripcion: "" }

export default function InventarioProductos() {
  const { user, rol, cargando } = useAuthUser()
  const { productos, loading: cargandoProductos } = useProductos()
  const [form, setForm] = useState(formVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [migrando, setMigrando] = useState(false)

  const puedeEntrar = rol === "admin"

  if (cargando) return null
  if (!user) return <LoginForm titulo="Productos — Iniciar sesión" emoji="🛠️" />
  if (!puedeEntrar) {
    return (
      <div style={{ background: bgGradient, minHeight: "100vh" }} className="flex flex-col items-center justify-center px-4 gap-4">
        <p style={{ color: "rgba(212,168,67,0.6)" }}>Solo el administrador puede editar productos.</p>
        <button onClick={cerrarSesion} className="text-xs underline" style={{ color: "rgba(212,168,67,0.5)" }}>Cerrar sesión</button>
      </div>
    )
  }

  const limpiarForm = () => { setForm(formVacio); setEditandoId(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombreProducto || !form.precio || !form.idCategoria) {
      toast.error("Nombre, precio y categoría son obligatorios")
      return
    }
    const cat = categorias.find((c) => c.idCategoria === Number(form.idCategoria))
    const data = {
      nombreProducto: form.nombreProducto,
      precio: Number(form.precio),
      idCategoria: Number(form.idCategoria),
      categoriaNombre: cat?.nombre || "",
      imagenUrl: form.imagenUrl,
      descripcion: form.descripcion,
      activo: true,
    }
    try {
      if (editandoId) {
        await actualizarProducto(editandoId, data)
        toast.success("Producto actualizado")
      } else {
        const idProducto = Math.max(0, ...productos.map((p) => p.idProducto || 0)) + 1
        await crearProducto({ ...data, idProducto })
        toast.success("Producto creado")
      }
      limpiarForm()
    } catch {
      toast.error("No se pudo guardar")
    }
  }

  const handleEditar = (p) => {
    setForm({
      nombreProducto: p.nombreProducto || "",
      precio: p.precio || "",
      idCategoria: p.idCategoria || "",
      imagenUrl: p.imagenUrl || "",
      descripcion: p.descripcion || "",
    })
    setEditandoId(p._docId)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleEliminar = async (docId, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esto no se puede deshacer.`)) return
    try {
      await eliminarProducto(docId)
      toast.success("Producto eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  const handleMigrar = async () => {
    if (!confirm("Esto sube tus productos originales a Firestore. Solo debe hacerse UNA vez, con la lista vacía. ¿Continuar?")) return
    setMigrando(true)
    try {
      const n = await migrarProductosSemilla()
      toast.success(`${n} productos migrados`)
    } catch (err) {
      toast.error(err.message || "No se pudo migrar")
    } finally {
      setMigrando(false)
    }
  }

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-8 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Link to="/inventario" style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>← INVENTARIO</Link>
          <span style={{ color: "rgba(212,168,67,0.25)" }}>·</span>
          <button onClick={cerrarSesion} style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>CERRAR SESIÓN</button>
        </div>
        <h1 className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "4px" }}>
          Productos
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        {!cargandoProductos && productos.length === 0 && (
          <button
            onClick={handleMigrar}
            disabled={migrando}
            className="w-full mb-6 rounded-xl py-3 font-bold uppercase text-xs disabled:opacity-50"
            style={{ border: "1px dashed rgba(212,168,67,0.5)", color: "#d4a843", letterSpacing: "1px" }}
          >
            {migrando ? "Migrando..." : "⬆️ Migrar productos originales a Firestore (una sola vez)"}
          </button>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8 p-4 rounded-xl" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)" }}>
          <h2 className="font-black uppercase text-sm mb-1" style={{ color: "#d4a843", letterSpacing: "2px" }}>
            {editandoId ? "Editar producto" : "Agregar producto"}
          </h2>
          <input placeholder="Nombre del producto" value={form.nombreProducto} onChange={(e) => setForm({ ...form, nombreProducto: e.target.value })} className="rounded-lg px-4 py-3 outline-none" style={inputStyle} />
          <input type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="rounded-lg px-4 py-3 outline-none" style={inputStyle} />
          <select value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })} className="rounded-lg px-4 py-3 outline-none" style={inputStyle}>
            <option value="">Selecciona categoría</option>
            {categoriasHoja.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
          </select>
          <input placeholder="Link de la imagen (URL de Cloudinary)" value={form.imagenUrl} onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })} className="rounded-lg px-4 py-3 outline-none" style={inputStyle} />
          <textarea placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={2} className="rounded-lg px-4 py-3 outline-none resize-none" style={inputStyle} />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-lg py-3 font-black uppercase text-xs" style={{ background: "#d4a843", color: "#1a0205", letterSpacing: "1px" }}>
              {editandoId ? "Guardar cambios" : "Crear producto"}
            </button>
            {editandoId && (
              <button type="button" onClick={limpiarForm} className="rounded-lg py-3 px-4 font-bold uppercase text-xs" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista */}
        {cargandoProductos ? (
          <p className="text-center py-10" style={{ color: "rgba(212,168,67,0.4)" }}>Cargando...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {productos.map((p) => (
              <div key={p._docId} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.15)" }}>
                <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "44px", height: "44px", background: "rgba(139,0,0,0.15)" }}>
                  {p.imagenUrl && <img src={p.imagenUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none" }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate" style={{ color: "white", fontSize: "13px" }}>{p.nombreProducto}</p>
                  <p style={{ color: "rgba(212,168,67,0.5)", fontSize: "11px" }}>{p.categoriaNombre} · ${Number(p.precio).toLocaleString("es-CO")}</p>
                </div>
                <button onClick={() => handleEditar(p)} className="text-xs font-bold px-3 py-2 rounded-lg" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}>Editar</button>
                <button onClick={() => handleEliminar(p._docId, p.nombreProducto)} className="text-xs font-bold px-3 py-2 rounded-lg" style={{ border: "1px solid rgba(255,100,100,0.4)", color: "#ff8080" }}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}