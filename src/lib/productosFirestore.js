import {
  collection, doc, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, getDocs,
} from "firebase/firestore"
import { db } from "../firebase"
import { productosSemilla } from "../data/productosSemilla"

const COL = "productos"

// Suscripción en vivo a todos los productos.
export function suscribirProductos(callback) {
  return onSnapshot(collection(db, COL), (snap) => {
    const productos = snap.docs.map((d) => ({ ...d.data(), _docId: d.id }))
    callback(productos)
  })
}

export async function crearProducto(data) {
  await addDoc(collection(db, COL), { activo: true, ...data })
}

export async function actualizarProducto(docId, data) {
  await updateDoc(doc(db, COL, docId), data)
}

export async function eliminarProducto(docId) {
  await deleteDoc(doc(db, COL, docId))
}

// Migración de una sola vez: sube los productos de la semilla estática a Firestore.
// Solo debe usarse si la colección está vacía (para no duplicar).
export async function migrarProductosSemilla() {
  const existentes = await getDocs(collection(db, COL))
  if (!existentes.empty) {
    throw new Error("Ya hay productos en Firestore. La migración solo se puede correr una vez, con la colección vacía.")
  }
  for (const p of productosSemilla) {
    await setDoc(doc(db, COL, String(p.idProducto)), p)
  }
  return productosSemilla.length
}