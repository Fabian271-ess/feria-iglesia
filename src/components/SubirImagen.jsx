import { useRef, useState } from "react"
import toast from "react-hot-toast"

// No sube nada a Cloudinary: solo elige el archivo y muestra una vista previa local.
// La subida real la hace quien use este componente, en el momento de guardar (ver
// subirImagenCloudinary en ../lib/cloudinary).
export default function SubirImagen({ preview, onArchivo, onLink, onQuitar }) {
  const inputRef = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [mostrarLinkManual, setMostrarLinkManual] = useState(false)

  const elegirArchivo = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen")
      return
    }
    onArchivo(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setArrastrando(false)
    elegirArchivo(e.dataTransfer.files?.[0])
  }

  if (preview) {
    return (
      <div className="flex items-center gap-3 rounded-lg p-3" style={{ border: "1px solid rgba(212,168,67,0.35)" }}>
        <img src={preview} alt="" className="rounded-lg object-cover flex-shrink-0" style={{ width: "56px", height: "56px" }} />
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <button type="button" onClick={() => inputRef.current?.click()} className="text-left text-xs font-bold uppercase" style={{ color: "#d4a843", letterSpacing: "1px" }}>
            Cambiar imagen
          </button>
          <button type="button" onClick={onQuitar} className="text-left text-xs font-bold uppercase" style={{ color: "rgba(255,100,100,0.7)", letterSpacing: "1px" }}>
            Quitar
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => elegirArchivo(e.target.files?.[0])} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-2 rounded-lg py-6 px-4 cursor-pointer text-center"
        style={{
          border: `1px dashed ${arrastrando ? "#d4a843" : "rgba(212,168,67,0.35)"}`,
          background: arrastrando ? "rgba(212,168,67,0.08)" : "transparent",
        }}
      >
        <span style={{ fontSize: "24px" }}>📷</span>
        <span className="text-xs font-bold uppercase" style={{ color: "rgba(212,168,67,0.6)", letterSpacing: "1px" }}>
          Arrastra una imagen o haz clic para seleccionarla
        </span>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => elegirArchivo(e.target.files?.[0])} />
      </div>

      <button type="button" onClick={() => setMostrarLinkManual((v) => !v)} className="text-left text-xs font-bold uppercase" style={{ color: "rgba(212,168,67,0.5)", letterSpacing: "1px" }}>
        {mostrarLinkManual ? "▲ Ocultar" : "¿Prefieres pegar un link?"}
      </button>
      {mostrarLinkManual && (
        <input
          placeholder="Link de la imagen"
          onChange={(e) => onLink(e.target.value)}
          className="rounded-lg px-4 py-3 outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
        />
      )}
    </div>
  )
}
