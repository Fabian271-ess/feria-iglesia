import { useState } from "react"
import { iniciarSesion } from "../lib/auth"

export default function LoginForm({ titulo = "Iniciar sesión", emoji = "🔒", onSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setCargando(true)
    try {
      await iniciarSesion(email.trim(), password)
      onSuccess?.()
    } catch {
      setError("Correo o contraseña incorrectos")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="w-full max-w-sm py-10 px-8 rounded-2xl" style={{ background: "rgba(26,2,5,0.9)", border: "1px solid rgba(212,168,67,0.25)" }}>
      <p className="text-center mb-1" style={{ fontSize: "40px" }}>{emoji}</p>
      <h1 className="font-black uppercase text-center mb-6" style={{ color: "#d4a843", fontFamily: "'Arial Black', sans-serif", fontSize: "18px", letterSpacing: "3px" }}>
        {titulo}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          className="rounded-lg px-4 py-3 outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="rounded-lg px-4 py-3 outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,168,67,0.35)", color: "#f5e6c8" }}
        />
        {error && <p className="text-sm text-center" style={{ color: "#ff8080" }}>{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg py-3 font-black uppercase transition-all duration-200 active:scale-95 disabled:opacity-50"
          style={{ background: "#d4a843", color: "#1a0205", letterSpacing: "2px", fontSize: "13px" }}
        >
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
