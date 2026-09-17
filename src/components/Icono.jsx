// Íconos de Material Symbols (Material 3) — la fuente se carga en index.html.
// Nombres válidos: https://fonts.google.com/icons
export default function Icono({ nombre, size = 18, style }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: size, lineHeight: 1, ...style }}
    >
      {nombre}
    </span>
  )
}
