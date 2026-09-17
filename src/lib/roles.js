// Correo -> rol. Estos son los usuarios reales creados en Firebase Authentication.
// Roles disponibles:
//   admin           -> acceso total: las 2 carpas, resumen general, productos
//   gerente_carpa1  -> Carpa 1: registrar ventas, agregar/eliminar productos propios, resumen de su carpa
//   gerente_carpa2  -> igual que gerente_carpa1, para Carpa 2
//   resumen         -> solo puede ver el resumen general combinado
export const ROLES_POR_CORREO = {
  "admin@feria.com": "admin",
  "gerente1@feria.com": "gerente_carpa1",
  "gerente2@feria.com": "gerente_carpa2",
  "resumen@feria.com": "resumen",
}

export function obtenerRol(user) {
  if (!user?.email) return null
  return ROLES_POR_CORREO[user.email.toLowerCase()] || null
}
