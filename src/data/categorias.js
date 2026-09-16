// Categorías estáticas – Feria Corazones Fuertes

export const categorias = [
  {"idCategoria":1,"nombre":"Accesorios de Cabello","idPadre":null,"descripcion":"Moñas, corbatas y diademas artesanales"},
  {"idCategoria":2,"nombre":"Construcción","idPadre":null,"descripcion":"Macetas artesanales hechas a mano"},
  {"idCategoria":3,"nombre":"Chocolatería","idPadre":null,"descripcion":"Chocomensajes, chocolates, rositas y corazones"},
  {"idCategoria":4,"nombre":"Moñas Coquette","idPadre":1},
  {"idCategoria":5,"nombre":"Moña Scrunchie","idPadre":1},
  {"idCategoria":6,"nombre":"Diademas","idPadre":1},
  {"idCategoria":7,"nombre":"Macetas Pequeñas","idPadre":2},
  {"idCategoria":9,"nombre":"Macetas Grandes","idPadre":2},
  {"idCategoria":10,"nombre":"Chocomensajes","idPadre":3},
  {"idCategoria":11,"nombre":"Chocolates Sueltos","idPadre":3},
  {"idCategoria":12,"nombre":"Rositas","idPadre":3},
  {"idCategoria":13,"nombre":"Corazones","idPadre":3},
]

export const getCategoriaById     = (id) => categorias.find((c) => c.idCategoria === id)
export const getCategoriasSinPadre = () => categorias.filter((c) => !c.idPadre)
export const getSubcategorias      = (idPadre) => categorias.filter((c) => c.idPadre === idPadre)