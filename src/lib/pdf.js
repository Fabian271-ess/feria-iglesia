import { jsPDF } from "jspdf"

const DORADO = [212, 168, 67]
const DORADO_CLARO = [242, 201, 110]
const VINO = [26, 2, 5]
const VINO_CLARO = [61, 0, 8]
const CREMA = [245, 230, 200]
const GRIS = [140, 130, 120]
const FILA_PAR = [250, 246, 236]

function moneda(n) {
  return "$" + Number(n).toLocaleString("es-CO")
}

const MARGEN = 48
const ALTO_HEADER = 130

function dibujarEncabezado(doc, anchoPagina, titulo, fecha) {
  doc.setFillColor(...VINO)
  doc.rect(0, 0, anchoPagina, ALTO_HEADER, "F")
  doc.setFillColor(...VINO_CLARO)
  doc.rect(0, 0, anchoPagina, 6, "F")

  doc.setTextColor(...GRIS)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("ADOLESCENTES IPUC PISARREAL 2026", anchoPagina / 2, 34, { align: "center" })

  doc.setTextColor(...DORADO)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.text("FERIA CORAZONES FUERTES", anchoPagina / 2, 62, { align: "center" })

  doc.setDrawColor(...DORADO)
  doc.setLineWidth(0.75)
  doc.line(anchoPagina / 2 - 60, 74, anchoPagina / 2 + 60, 74)

  doc.setTextColor(...CREMA)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text(titulo.toUpperCase(), anchoPagina / 2, 96, { align: "center" })

  doc.setTextColor(...DORADO_CLARO)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(fecha, anchoPagina / 2, 114, { align: "center" })
}

function dibujarTarjetaTotal(doc, x, y, ancho, alto, etiqueta, valor, grande) {
  doc.setFillColor(253, 250, 242)
  doc.setDrawColor(...DORADO)
  doc.setLineWidth(1)
  doc.roundedRect(x, y, ancho, alto, 8, 8, "FD")

  doc.setTextColor(...GRIS)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text(etiqueta.toUpperCase(), x + ancho / 2, y + 20, { align: "center" })

  doc.setTextColor(...VINO)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(grande ? 26 : 18)
  doc.text(moneda(valor), x + ancho / 2, y + (grande ? 46 : 40), { align: "center" })
}

// datos = {
//   titulo, fecha,
//   totalGeneral,
//   carpas: [{ nombre, total }] | null,
//   productos: [{ nombre, cant, subtotal }],
// }
export function generarPDFResumen(datos) {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const anchoPagina = doc.internal.pageSize.getWidth()
  const altoPagina = doc.internal.pageSize.getHeight()
  const anchoUtil = anchoPagina - MARGEN * 2

  dibujarEncabezado(doc, anchoPagina, datos.titulo, datos.fecha)

  let y = ALTO_HEADER + 36

  // Tarjeta grande de total general
  dibujarTarjetaTotal(doc, MARGEN, y, anchoUtil, 62, "Total", datos.totalGeneral, true)
  y += 62 + 20

  // Tarjetas de cada carpa, lado a lado
  if (datos.carpas?.length === 2) {
    const anchoTarjeta = (anchoUtil - 16) / 2
    dibujarTarjetaTotal(doc, MARGEN, y, anchoTarjeta, 56, datos.carpas[0].nombre, datos.carpas[0].total, false)
    dibujarTarjetaTotal(doc, MARGEN + anchoTarjeta + 16, y, anchoTarjeta, 56, datos.carpas[1].nombre, datos.carpas[1].total, false)
    y += 56 + 30
  } else {
    y += 10
  }

  // Título de la tabla
  doc.setTextColor(...VINO)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Detalle por producto", MARGEN, y)
  y += 14

  // Cabecera de tabla
  const colProducto = MARGEN + 12
  const colCantidad = anchoPagina - MARGEN - 150
  const colSubtotal = anchoPagina - MARGEN - 12

  const dibujarCabeceraTabla = () => {
    doc.setFillColor(...VINO)
    doc.roundedRect(MARGEN, y, anchoUtil, 26, 4, 4, "F")
    doc.setTextColor(...DORADO)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text("PRODUCTO", colProducto, y + 17)
    doc.text("CANT.", colCantidad, y + 17, { align: "right" })
    doc.text("SUBTOTAL", colSubtotal, y + 17, { align: "right" })
    y += 26
  }

  dibujarCabeceraTabla()

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9.5)

  if (!datos.productos.length) {
    doc.setTextColor(...GRIS)
    doc.setFillColor(...FILA_PAR)
    doc.rect(MARGEN, y, anchoUtil, 24, "F")
    doc.text("Sin ventas registradas todavía", colProducto, y + 16)
    y += 24
  } else {
    datos.productos.forEach((p, i) => {
      const alturaFila = 22
      if (y + alturaFila > altoPagina - 60) {
        doc.addPage()
        y = MARGEN
        dibujarCabeceraTabla()
      }
      if (i % 2 === 0) {
        doc.setFillColor(...FILA_PAR)
        doc.rect(MARGEN, y, anchoUtil, alturaFila, "F")
      }
      doc.setTextColor(50, 40, 35)
      doc.setFont("helvetica", "normal")
      const nombreCorto = p.nombre.length > 42 ? p.nombre.slice(0, 40) + "…" : p.nombre
      doc.text(nombreCorto, colProducto, y + 15)
      doc.text(String(p.cant), colCantidad, y + 15, { align: "right" })
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...VINO)
      doc.text(moneda(p.subtotal), colSubtotal, y + 15, { align: "right" })
      y += alturaFila
    })
  }

  // Línea de cierre de la tabla
  doc.setDrawColor(...DORADO)
  doc.setLineWidth(0.5)
  doc.line(MARGEN, y, anchoPagina - MARGEN, y)

  // Pie de página en todas las hojas
  const totalPaginas = doc.internal.getNumberOfPages()
  for (let p = 1; p <= totalPaginas; p++) {
    doc.setPage(p)
    doc.setDrawColor(...DORADO)
    doc.setLineWidth(0.5)
    doc.line(MARGEN, altoPagina - 40, anchoPagina - MARGEN, altoPagina - 40)
    doc.setTextColor(...GRIS)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.text(`Generado ${new Date().toLocaleString("es-CO")}`, MARGEN, altoPagina - 26)
    doc.text(`Página ${p} de ${totalPaginas}`, anchoPagina - MARGEN, altoPagina - 26, { align: "right" })
  }

  doc.save(`cierre-de-caja-${new Date().toISOString().slice(0, 10)}.pdf`)
}