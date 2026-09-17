import { createContext, useContext, useEffect, useState } from "react"
import { suscribirCategorias } from "../lib/categoriasFirestore"

const CategoriasContext = createContext({ categorias: [], loading: true })

export function CategoriasProvider({ children }) {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = suscribirCategorias((data) => {
      setCategorias(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <CategoriasContext.Provider value={{ categorias, loading }}>
      {children}
    </CategoriasContext.Provider>
  )
}

export function useCategorias() {
  return useContext(CategoriasContext)
}
