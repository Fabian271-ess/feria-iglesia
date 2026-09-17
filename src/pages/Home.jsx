import logoFeria from "../assets/logo-feria.png"

export default function Home() {
  return (
    <div style={{ background: "linear-gradient(135deg, #3d0008 0%, #1a0205 50%, #2a0a0a 100%)", height: "calc(100vh - 68px - 300px)", minHeight: "360px", overflow: "hidden" }}>
      <section
        className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-14 px-6 md:px-12 h-full overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(212,168,67,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="absolute top-10 right-10 pointer-events-none" style={{ color: "#d4a843", fontSize: "48px", opacity: 0.25 }}>✦</div>
        <div className="absolute top-20 left-10 pointer-events-none" style={{ color: "#d4a843", fontSize: "32px", opacity: 0.15 }}>✦</div>

        <img
          src={logoFeria}
          alt="Corazones Fuertes"
          className="flex-shrink-0"
          style={{ height: "min(80%, 60vh)", maxWidth: "45%", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(212,168,67,0.4))" }}
        />

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div
            className="mb-3 px-4 py-1 rounded-full text-xs font-bold uppercase"
            style={{ border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843", letterSpacing: "4px", background: "rgba(212,168,67,0.08)" }}
          >
            Adolescentes IPUC Pisarreal 2026
          </div>

          <h1
            className="font-black uppercase leading-none mb-3"
            style={{ fontFamily: "'Arial Black', sans-serif", fontSize: "clamp(28px, 6vw, 56px)", color: "white" }}
          >
            Feria
            <span style={{ color: "#d4a843", display: "block", fontSize: "clamp(16px, 3vw, 30px)", letterSpacing: "8px", fontWeight: "400", marginTop: "4px" }}>
              Corazones Fuertes
            </span>
          </h1>

          <p
            className="max-w-md font-semibold"
            style={{ color: "rgba(212,168,67,0.65)", fontSize: "15px", lineHeight: "1.7" }}
          >
            Encuentra accesorios de cabello, macetas artesanales y deliciosa chocolatería. ¡Todo con amor y propósito!
          </p>
        </div>
      </section>
    </div>
  )
}
