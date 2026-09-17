import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import { ProductosProvider } from "./context/ProductosContext"
import { CategoriasProvider } from "./context/CategoriasContext"
import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import Productos from "./pages/Productos"
import Categorias from "./pages/Categorias"
import ProductDetail from "./pages/ProductDetail"
import Busqueda from "./pages/Busqueda"
import NotFound from "./pages/NotFound"
import Inventario from "./pages/Inventario"
import InventarioCarpa from "./pages/InventarioCarpa"
import InventarioResumen from "./pages/InventarioResumen"
import InventarioProductos from "./pages/InventarioProductos"

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ProductosProvider>
      <CategoriasProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="bottom-center" toastOptions={{ style: { background: "#1a0205", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" } }} />
          <Routes>
            <Route path="/"                             element={<Layout><Home /></Layout>} />
            <Route path="/catalogo"                     element={<Layout><Catalog /></Layout>} />
            <Route path="/catalogo/:seccion"            element={<Layout><Catalog /></Layout>} />
            <Route path="/catalogo/:seccion/:subseccion" element={<Layout><Catalog /></Layout>} />
            <Route path="/productos"                    element={<Layout><Productos /></Layout>} />
            <Route path="/categorias"                   element={<Layout><Categorias /></Layout>} />
            <Route path="/producto/:id"                 element={<Layout><ProductDetail /></Layout>} />
            <Route path="/busqueda"                     element={<Layout><Busqueda /></Layout>} />
            <Route path="/inventario"                   element={<Layout><Inventario /></Layout>} />
            <Route path="/inventario/resumen"           element={<Layout><InventarioResumen /></Layout>} />
            <Route path="/inventario/productos"         element={<Layout><InventarioProductos /></Layout>} />
            <Route path="/inventario/:carpa"             element={<Layout><InventarioCarpa /></Layout>} />
            <Route path="*"                             element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </CategoriasProvider>
    </ProductosProvider>
  )
}