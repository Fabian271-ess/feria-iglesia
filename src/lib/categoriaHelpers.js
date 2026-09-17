// Helpers que operan sobre un arreglo de categorías que les pasan (viene de Firestore en vivo).

export const getCategoriaById      = (categorias, id) => categorias.find((c) => c.idCategoria === id)
export const getCategoriasSinPadre = (categorias) => categorias.filter((c) => !c.idPadre)
export const getSubcategorias      = (categorias, idPadre) => categorias.filter((c) => c.idPadre === idPadre)

// Convierte el nombre de una categoría en el slug que se usa en la URL del catálogo.
export const normalizeSlug = (str) =>
  str?.toLowerCase()
    .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú|ü/g, "u")
    .replace(/ /g, "-")

// Emojis de respaldo para categorías creadas antes de que existiera el campo "icono".
// Las categorías nuevas deberían traer su propio icono desde Firestore.
export const EMOJIS_CATEGORIA = {
  "accesorios de cabello": "🎀", "construcción": "🪴", "chocolatería": "🍫", "repostería": "🍫",
  "moñas coquette": "🎀", "moñas": "🎀", "moña scrunchie": "🪢", "corbatas": "🎗️", "diademas": "👑",
  "chocomensajes": "💌", "chocolates sueltos": "🍫", "rositas": "🌸",
  "corazones": "❤️", "macetas pequeñas": "🪴", "macetas medianas": "🌿", "macetas grandes": "🌳",
}

// El icono de la categoría (si lo tiene) manda sobre el mapa de respaldo por nombre.
export const getEmojiCategoria = (nombre, icono) => icono || EMOJIS_CATEGORIA[nombre?.toLowerCase()] || "🛍️"
