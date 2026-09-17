import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useProductos } from "../context/ProductosContext"
import { useCategorias } from "../context/CategoriasContext"
import { useAuthUser } from "../lib/useAuthUser"
import { EstadoAcceso } from "../components/EstadoAcceso"
import { getCategoriasSinPadre, getSubcategorias } from "../lib/categoriaHelpers"
import { crearProducto, actualizarProducto, eliminarProducto } from "../lib/productosFirestore"
import { crearCategoria, actualizarCategoria, eliminarCategoria } from "../lib/categoriasFirestore"
import { subirImagenCloudinary } from "../lib/cloudinary"
import SelectorEmoji from "../components/SelectorEmoji"
import SubirImagen from "../components/SubirImagen"

const bgGradient = "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)"

const formVacio = { nombreProducto: "", precio: "", idCategoria: "", imagenUrl: "", descripcion: "" }
const categoriaNuevaVacia = { nombre: "", idPadre: "", icono: "", idCategoria: null }

export default function InventarioProductos() {
  const { user, rol, cargando } = useAuthUser()
  const { productos, loading: cargandoProductos } = useProductos()
  const { categorias } = useCategorias()
  const [form, setForm] = useState(formVacio)
  const [imagenArchivo, setImagenArchivo] = useState(null) // File elegido, pendiente de subir
  const [previewImagen, setPreviewImagen] = useState("")
  const [editandoId, setEditandoId] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false)
  const [nuevaCategoria, setNuevaCategoria] = useState(categoriaNuevaVacia)
  const [crearComoSeccion, setCrearComoSeccion] = useState(false)
  const [editandoCategoriaId, setEditandoCategoriaId] = useState(null)

  const rolEsGerente = rol?.startsWith("gerente_")
  const puedeEntrar = rol === "admin" || rolEsGerente

  useEffect(() => {
    if (!imagenArchivo) {
      setPreviewImagen(form.imagenUrl)
      return
    }
    const url = URL.createObjectURL(imagenArchivo)
    setPreviewImagen(url)
    return () => URL.revokeObjectURL(url)
  }, [imagenArchivo, form.imagenUrl])

  if (cargando || !user || !puedeEntrar) {
    return (
      <EstadoAcceso
        cargando={cargando}
        user={user}
        autorizado={puedeEntrar}
        titulo="Productos — Iniciar sesión"
        emoji="🛠️"
        mensajeDenegado="Tu cuenta no tiene acceso a productos."
      />
    )
  }

  const categoriasHoja = categorias.filter((c) => c.idPadre) // solo las de hasta abajo, donde van los productos
  const seccionesPadre = getCategoriasSinPadre(categorias)

  const limpiarForm = () => { setForm(formVacio); setImagenArchivo(null); setEditandoId(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombreProducto || !form.precio || !form.idCategoria) {
      toast.error("Nombre, precio y categoría son obligatorios")
      return
    }
    setGuardando(true)
    try {
      let imagenUrl = form.imagenUrl
      if (imagenArchivo) {
        imagenUrl = await subirImagenCloudinary(imagenArchivo)
      }
      const cat = categorias.find((c) => c.idCategoria === Number(form.idCategoria))
      const data = {
        nombreProducto: form.nombreProducto,
        precio: Number(form.precio),
        idCategoria: Number(form.idCategoria),
        categoriaNombre: cat?.nombre || "",
        imagenUrl,
        descripcion: form.descripcion,
        activo: true,
      }
      if (editandoId) {
        await actualizarProducto(editandoId, data)
        toast.success("Producto actualizado")
      } else {
        const idProducto = Math.max(0, ...productos.map((p) => p.idProducto || 0)) + 1
        await crearProducto({ ...data, idProducto })
        toast.success("Producto creado")
      }
      limpiarForm()
    } catch (err) {
      toast.error(err.message || "No se pudo guardar")
    } finally {
      setGuardando(false)
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
    setImagenArchivo(null)
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

  const limpiarFormCategoria = () => {
    setNuevaCategoria(categoriaNuevaVacia)
    setCrearComoSeccion(false)
    setEditandoCategoriaId(null)
  }

  const handleEditarCategoria = (cat) => {
    setNuevaCategoria({
      nombre: cat.nombre || "",
      idPadre: cat.idPadre ? String(cat.idPadre) : "",
      icono: cat.icono || "",
      idCategoria: cat.idCategoria,
    })
    setCrearComoSeccion(!cat.idPadre)
    setEditandoCategoriaId(cat._docId)
    setMostrarNuevaCategoria(true)
  }

  const handleCrearCategoria = async (e) => {
    e.preventDefault()
    if (!nuevaCategoria.nombre || (!crearComoSeccion && !nuevaCategoria.idPadre)) {
      toast.error(crearComoSeccion ? "El nombre es obligatorio" : "Nombre y sección son obligatorios")
      return
    }
    try {
      const idPadre = crearComoSeccion ? null : Number(nuevaCategoria.idPadre)
      if (editandoCategoriaId) {
        await actualizarCategoria(editandoCategoriaId, { nombre: nuevaCategoria.nombre, idPadre, icono: nuevaCategoria.icono || null })
        toast.success(crearComoSeccion ? "Sección actualizada" : "Categoría actualizada")
      } else {
        const idCategoria = Math.max(0, ...categorias.map((c) => c.idCategoria || 0)) + 1
        await crearCategoria({ nombre: nuevaCategoria.nombre, idPadre, idCategoria, icono: nuevaCategoria.icono || null })
        toast.success(crearComoSeccion ? "Sección creada" : "Categoría creada")
        if (!crearComoSeccion) setForm((f) => ({ ...f, idCategoria: String(idCategoria) }))
      }
      limpiarFormCategoria()
      setMostrarNuevaCategoria(false)
    } catch {
      toast.error(editandoCategoriaId ? "No se pudo guardar los cambios" : (crearComoSeccion ? "No se pudo crear la sección" : "No se pudo crear la categoría"))
    }
  }

  const handleEliminarCategoria = async (cat) => {
    if (rolEsGerente) {
      toast.error("Solo el administrador puede eliminar categorías o secciones.")
      return
    }
    const esSeccion = !cat.idPadre
    if (esSeccion && categorias.some((c) => c.idPadre === cat.idCategoria)) {
      toast.error("Esta sección tiene categorías dentro. Elimínalas primero.")
      return
    }
    if (productos.some((p) => p.idCategoria === cat.idCategoria)) {
      toast.error("Hay productos usando esta categoría. Muévelos o elimínalos primero.")
      return
    }
    if (!confirm(`¿Eliminar "${cat.nombre}"? Esto no se puede deshacer.`)) return
    try {
      await eliminarCategoria(cat._docId)
      toast.success(esSeccion ? "Sección eliminada" : "Categoría eliminada")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }

  return (
    <div style={{ background: bgGradient, minHeight: "100vh" }}>
      <div className="w-full py-8 px-4 text-center" style={{ borderBottom: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <Link to="/inventario" style={{ color: "rgba(212,168,67,0.4)", fontSize: "11px", letterSpacing: "2px" }}>← INVENTARIO</Link>
        </div>
        <h1 className="font-black uppercase" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(24px, 5vw, 36px)", letterSpacing: "4px" }}>
          Productos
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-20">
        {/* Categorías y secciones */}
        <form onSubmit={handleCrearCategoria} className="flex flex-col gap-3 mb-8 p-4 rounded-xl" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)" }}>
          <button type="button" onClick={() => setMostrarNuevaCategoria((v) => !v)} className="font-black uppercase text-sm mb-1 text-left" style={{ color: "#d4a843", letterSpacing: "2px" }}>
            {mostrarNuevaCategoria ? "▲ Categorías y secciones" : "▾ Categorías y secciones"}
          </button>
          {mostrarNuevaCategoria && (
            <>
              <label className="flex items-center gap-2 text-xs font-bold uppercase" style={{ color: "rgba(212,168,67,0.6)", letterSpacing: "1px" }}>
                <input
                  type="checkbox"
                  checked={crearComoSeccion}
                  onChange={(e) => setCrearComoSeccion(e.target.checked)}
                />
                Es una sección nueva (sin categoría padre)
              </label>
              <input
                placeholder={crearComoSeccion ? "Nombre de la sección" : "Nombre de la categoría"}
                value={nuevaCategoria.nombre}
                onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                className="rounded-lg px-4 py-3 outline-none"
                style={inputStyle}
              />
              <SelectorEmoji
                value={nuevaCategoria.icono}
                onChange={(icono) => setNuevaCategoria({ ...nuevaCategoria, icono })}
              />
              {!crearComoSeccion && (
                <select
                  value={nuevaCategoria.idPadre}
                  onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, idPadre: e.target.value })}
                  className="rounded-lg px-4 py-3 outline-none"
                  style={inputStyle}
                >
                  <option value="">Selecciona sección</option>
                  {seccionesPadre.map((s) => <option key={s.idCategoria} value={s.idCategoria}>{s.nombre}</option>)}
                </select>
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-lg py-2 font-black uppercase text-xs" style={{ background: "#d4a843", color: "#1a0205", letterSpacing: "1px" }}>
                  {editandoCategoriaId ? "Guardar cambios" : (crearComoSeccion ? "Crear sección" : "Crear categoría")}
                </button>
                {editandoCategoriaId && (
                  <button type="button" onClick={limpiarFormCategoria} className="rounded-lg py-2 px-4 font-bold uppercase text-xs" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}>
                    Cancelar
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {seccionesPadre.map((sec) => (
                  <div key={sec.idCategoria} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase" style={{ color: "#d4a843", letterSpacing: "1px" }}>
                        {sec.icono ? `${sec.icono} ` : ""}{sec.nombre}
                      </span>
                      <div className="flex gap-2 flex-shrink-0">
                        <button type="button" onClick={() => handleEditarCategoria(sec)} className="text-xs font-bold px-2 py-1 rounded-lg" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}>
                          Editar
                        </button>
                        {!rolEsGerente && (
                          <button type="button" onClick={() => handleEliminarCategoria(sec)} className="text-xs font-bold px-2 py-1 rounded-lg" style={{ border: "1px solid rgba(255,100,100,0.4)", color: "#ff8080" }}>
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                    {getSubcategorias(categorias, sec.idCategoria).map((cat) => (
                      <div key={cat.idCategoria} className="flex items-center justify-between gap-2 pl-4">
                        <span className="text-xs" style={{ color: "rgba(212,168,67,0.6)" }}>
                          {cat.icono ? `${cat.icono} ` : ""}{cat.nombre}
                        </span>
                        <div className="flex gap-2 flex-shrink-0">
                        <button type="button" onClick={() => handleEditarCategoria(cat)} className="text-xs font-bold px-2 py-1 rounded-lg" style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}>
                          Editar
                        </button>
                        {!rolEsGerente && (
                          <button type="button" onClick={() => handleEliminarCategoria(cat)} className="text-xs font-bold px-2 py-1 rounded-lg" style={{ border: "1px solid rgba(255,100,100,0.4)", color: "#ff8080" }}>
                            Eliminar
                          </button>
                        )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </form>

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

          <SubirImagen
            preview={previewImagen}
            onArchivo={(file) => { setImagenArchivo(file); setForm((f) => ({ ...f, imagenUrl: "" })) }}
            onLink={(imagenUrl) => { setImagenArchivo(null); setForm((f) => ({ ...f, imagenUrl })) }}
            onQuitar={() => { setImagenArchivo(null); setForm((f) => ({ ...f, imagenUrl: "" })) }}
          />
          <textarea placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={2} className="rounded-lg px-4 py-3 outline-none resize-none" style={inputStyle} />
          <div className="flex gap-2">
            <button type="submit" disabled={guardando} className="flex-1 rounded-lg py-3 font-black uppercase text-xs disabled:opacity-50" style={{ background: "#d4a843", color: "#1a0205", letterSpacing: "1px" }}>
              {guardando ? (imagenArchivo ? "Subiendo imagen..." : "Guardando...") : editandoId ? "Guardar cambios" : "Crear producto"}
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
                  <p style={{ color: "rgba(212,168,67,0.5)", fontSize: "11px" }}>
                    {p.categoriaNombre} · ${Number(p.precio).toLocaleString("es-CO")}
                  </p>
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
