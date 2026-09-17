import LoginForm from "./LoginForm"

export default function LoginModal({ abierto, onClose, onSuccess, titulo = "Iniciar sesión", emoji = "📦" }) {
  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-sm">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-black transition-transform duration-200 active:scale-90"
          style={{ background: "#d4a843", color: "#1a0205" }}
        >
          ✕
        </button>
        <LoginForm titulo={titulo} emoji={emoji} onSuccess={onSuccess} />
      </div>
    </div>
  )
}
