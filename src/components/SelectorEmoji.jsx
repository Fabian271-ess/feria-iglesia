import { useState } from "react"
import { EMOJIS_DISPONIBLES } from "../data/emojisCategoria"

const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")

export default function SelectorEmoji({ value, onChange }) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState("")

  const q = normalize(busqueda)
  const emojisFiltrados = q
    ? EMOJIS_DISPONIBLES.filter((e) => normalize(e.palabras).includes(q))
    : EMOJIS_DISPONIBLES

  const elegir = (emoji) => {
    onChange(emoji)
    setAbierto(false)
    setBusqueda("")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex items-center gap-3 rounded-lg px-4 py-3"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)" }}
      >
        <span style={{ fontSize: "22px" }}>{value || "🛍️"}</span>
        <span className="text-xs font-bold uppercase" style={{ color: "rgba(212,168,67,0.6)", letterSpacing: "1px" }}>
          {value ? "Cambiar icono" : "Elegir icono"}
        </span>
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setAbierto(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl p-4 flex flex-col gap-3"
            style={{ background: "#1a0205", border: "1px solid rgba(212,168,67,0.35)", maxHeight: "80vh" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-sm" style={{ color: "#d4a843", letterSpacing: "2px" }}>Elige un icono</h3>
              <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" style={{ color: "rgba(212,168,67,0.6)" }}>✕</button>
            </div>
            <input
              autoFocus
              placeholder="Buscar icono... (ej. flor, torta, cabello)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="rounded-lg px-4 py-3 outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
            />
            <div className="grid grid-cols-6 gap-1 overflow-y-auto">
              {emojisFiltrados.map((e) => (
                <button
                  key={e.emoji}
                  type="button"
                  onClick={() => elegir(e.emoji)}
                  className="flex items-center justify-center rounded-lg transition-colors duration-150"
                  style={{ fontSize: "24px", aspectRatio: "1", background: e.emoji === value ? "rgba(212,168,67,0.2)" : "transparent" }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "rgba(212,168,67,0.15)")}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = e.emoji === value ? "rgba(212,168,67,0.2)" : "transparent")}
                >
                  {e.emoji}
                </button>
              ))}
              {emojisFiltrados.length === 0 && (
                <p className="col-span-6 text-center py-6 text-xs" style={{ color: "rgba(212,168,67,0.4)" }}>Sin resultados</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
