const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Sube un archivo a Cloudinary usando un "unsigned upload preset" (sin exponer
// ninguna clave secreta en el navegador) y devuelve la URL pública de la imagen.
export async function subirImagenCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary no está configurado (faltan las variables de entorno)")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("No se pudo subir la imagen a Cloudinary")
  }

  const data = await res.json()
  return data.secure_url
}
