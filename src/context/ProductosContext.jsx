import { createContext, useContext, useEffect, useState } from "react"
import { suscribirProductos } from "../lib/productosFirestore"

const ProductosContext = createContext({ productos: [], loading: true })

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = suscribirProductos((data) => {
      setProductos(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <ProductosContext.Provider value={{ productos, loading }}>
      {children}
    </ProductosContext.Provider>
  )
}

export function useProductos() {
  return useContext(ProductosContext)
}