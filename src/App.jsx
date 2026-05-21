import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import ProductDetail from "./pages/ProductDetail"
import Busqueda from "./pages/Busqueda"
import NotFound from "./pages/NotFound"

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
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="bottom-center" toastOptions={{ style: { background: "#1a0205", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" } }} />
      <Routes>
        <Route path="/"                             element={<Layout><Home /></Layout>} />
        <Route path="/catalogo"                     element={<Layout><Catalog /></Layout>} />
        <Route path="/catalogo/:seccion"            element={<Layout><Catalog /></Layout>} />
        <Route path="/catalogo/:seccion/:subseccion" element={<Layout><Catalog /></Layout>} />
        <Route path="/producto/:id"                 element={<Layout><ProductDetail /></Layout>} />
        <Route path="/busqueda"                     element={<Layout><Busqueda /></Layout>} />
        <Route path="*"                             element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
