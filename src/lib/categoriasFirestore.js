import { collection, doc, onSnapshot, addDoc, setDoc, getDocs, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import { categoriasSemilla } from "../data/categoriasSemilla"

const COL = "categorias"

// Suscripción en vivo a todas las categorías. Si Firestore rechaza la lectura (por
// ejemplo, reglas de seguridad que todavía no cubren esta colección), no se queda
// esperando para siempre: avisa con una lista vacía para que la pantalla siga.
export function suscribirCategorias(callback) {
  return onSnapshot(
    collection(db, COL),
    (snap) => {
      const categorias = snap.docs.map((d) => ({ ...d.data(), _docId: d.id }))
      callback(categorias)
    },
    (error) => {
      console.error("No se pudieron leer las categorías:", error)
      callback([])
    }
  )
}

export async function crearCategoria(data) {
  await addDoc(collection(db, COL), data)
}

export async function actualizarCategoria(docId, data) {
  await setDoc(doc(db, COL, docId), data, { merge: true })
}

export async function eliminarCategoria(docId) {
  await deleteDoc(doc(db, COL, docId))
}

// Migración de una sola vez: sube las categorías de la semilla estática a Firestore.
// Solo debe usarse si la colección está vacía (para no duplicar).
export async function migrarCategoriasSemilla() {
  const existentes = await getDocs(collection(db, COL))
  if (!existentes.empty) {
    throw new Error("Ya hay categorías en Firestore. La migración solo se puede correr una vez, con la colección vacía.")
  }
  for (const c of categoriasSemilla) {
    await setDoc(doc(db, COL, String(c.idCategoria)), c)
  }
  return categoriasSemilla.length
}
