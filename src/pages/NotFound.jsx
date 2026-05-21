import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)" }}>
      <div className="text-center px-4">
        <p style={{ fontSize: "72px" }}>🛍️</p>
        <h1 className="font-black uppercase mt-4" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "48px", letterSpacing: "4px" }}>404</h1>
        <p className="mt-2" style={{ color: "rgba(212,168,67,0.5)", fontSize: "16px" }}>Página no encontrada</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-8 py-3 rounded-lg font-black uppercase"
          style={{ background: "linear-gradient(90deg, #6b0f1a, #d4a843, #6b0f1a)", color: "#1a0205", letterSpacing: "3px" }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
