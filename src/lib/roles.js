// Correo -> rol. Estos son los usuarios reales creados en Firebase Authentication.
export const ROLES_POR_CORREO = {
  "admin123@feria.com": "admin",
  "carpa1@feria.com": "carpa1",
  "carpa2@feria.com": "carpa2",
}

export function obtenerRol(user) {
  if (!user?.email) return null
  return ROLES_POR_CORREO[user.email.toLowerCase()] || null
}