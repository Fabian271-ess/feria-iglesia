import {
  doc, onSnapshot, setDoc, increment,
  collection, addDoc, serverTimestamp,
  query, orderBy, limit, getDocs, deleteDoc,
  where, Timestamp,
} from "firebase/firestore"
import { db } from "../firebase"

// Un documento por carpa: inventario/carpa1, inventario/carpa2
// Cada documento tiene:
//   - "ventas": { [idProducto]: cantidadVendida }
//   - "stock": { [idProducto]: cantidadDisponible } — el stock es de la carpa, no del
//     producto, así un mismo producto compartido puede tener cantidades distintas en
//     cada carpa.
// Y una subcolección "historial" con cada cambio, para poder deshacer.

export function suscribirCarpa(carpaId, callback) {
  const ref = doc(db, "inventario", carpaId)
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().ventas || {} : {})
  })
}

export function suscribirStockCarpa(carpaId, callback) {
  const ref = doc(db, "inventario", carpaId)
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().stock || {} : {})
  })
}

export async function establecerStock(carpaId, idProducto, cantidad) {
  const ref = doc(db, "inventario", carpaId)
  await setDoc(ref, { stock: { [idProducto]: cantidad } }, { merge: true })
}

export async function cambiarCantidad(carpaId, idProducto, delta, nombreProducto) {
  const ref = doc(db, "inventario", carpaId)
  await setDoc(
    ref,
    { ventas: { [idProducto]: increment(delta) } },
    { merge: true }
  )
  await addDoc(collection(db, "inventario", carpaId, "historial"), {
    idProducto,
    nombreProducto,
    delta,
    fecha: serverTimestamp(),
  })
}

// Deshace el último cambio registrado en esa carpa (sin importar si fue un + o un -).
// Devuelve los datos del cambio deshecho, o null si no había nada que deshacer.
export async function deshacerUltimoCambio(carpaId) {
  const q = query(
    collection(db, "inventario", carpaId, "historial"),
    orderBy("fecha", "desc"),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null

  const ultimo = snap.docs[0]
  const data = ultimo.data()
  const ref = doc(db, "inventario", carpaId)
  await setDoc(
    ref,
    { ventas: { [data.idProducto]: increment(-data.delta) } },
    { merge: true }
  )
  await deleteDoc(ultimo.ref)
  return data
}

// Historial en vivo de los cambios registrados hoy en esa carpa (más recientes primero).
export function suscribirHistorialHoy(carpaId, callback, max = 30) {
  const inicioHoy = new Date()
  inicioHoy.setHours(0, 0, 0, 0)
  const q = query(
    collection(db, "inventario", carpaId, "historial"),
    where("fecha", ">=", Timestamp.fromDate(inicioHoy)),
    orderBy("fecha", "desc"),
    limit(max)
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// --- Pendientes de pago: alguien se llevó el producto pero todavía no ha pagado ---
// Viven en inventario/{carpaId}/pendientes, y NO cuentan en "ventas" hasta que se marcan como pagados.

export function suscribirPendientes(carpaId, callback) {
  const q = query(collection(db, "inventario", carpaId, "pendientes"), orderBy("fecha", "desc"))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export async function crearPendiente(carpaId, { nombreComprador, idProducto, nombreProducto, cantidad, monto }) {
  await addDoc(collection(db, "inventario", carpaId, "pendientes"), {
    nombreComprador, idProducto, nombreProducto, cantidad, monto,
    fecha: serverTimestamp(),
  })
}

// Al marcar como pagado, se suma de una vez a "ventas" (como si se acabara de vender) y se borra de pendientes.
export async function marcarPendienteComoPagado(carpaId, pendiente) {
  await cambiarCantidad(carpaId, pendiente.idProducto, pendiente.cantidad, pendiente.nombreProducto)
  await deleteDoc(doc(db, "inventario", carpaId, "pendientes", pendiente.id))
}

export async function eliminarPendiente(carpaId, pendienteId) {
  await deleteDoc(doc(db, "inventario", carpaId, "pendientes", pendienteId))
}