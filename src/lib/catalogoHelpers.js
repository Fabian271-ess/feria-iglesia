// Helpers que operan sobre un arreglo de productos que les pasan (viene de Firestore en vivo).

export const getProductoById = (productos, id) =>
  productos.find((p) => String(p.idProducto) === String(id))

export const getProductosByCategoria = (productos, idCat) =>
  productos.filter((p) => p.idCategoria === idCat && p.activo !== false)

export const buscarProductos = (productos, q) => {
  const lower = q.toLowerCase()
  return productos.filter(
    (p) =>
      p.activo !== false &&
      (p.nombreProducto?.toLowerCase().includes(lower) ||
        p.categoriaNombre?.toLowerCase().includes(lower) ||
        p.descripcion?.toLowerCase().includes(lower))
  )
}