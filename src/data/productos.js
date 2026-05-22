// ── Datos estáticos – Feria Corazones Fuertes 2026 ──────────────

export const categorias = [
  // Raíz
  { idCategoria: 1, nombre: "Accesorios de Cabello", idPadre: null, descripcion: "Moñas, corbatas y diademas artesanales" },
  { idCategoria: 2, nombre: "Construcción",          idPadre: null, descripcion: "Macetas artesanales hechas a mano" },
  { idCategoria: 3, nombre: "Chocolatería",          idPadre: null, descripcion: "Chocomensajes, chocolates, rositas y corazones" },
  // Hijos de Accesorios
  { idCategoria: 4, nombre: "Moñas Coquette",           idPadre: 1 },
  { idCategoria: 5, nombre: "Moña Scrunchie",  idPadre: 1 },
  { idCategoria: 6, nombre: "Diademas",        idPadre: 1 },
  // Hijos de Construcción
  { idCategoria: 7, nombre: "Macetas Pequeñas",  idPadre: 2 },
  { idCategoria: 9, nombre: "Macetas Grandes",   idPadre: 2 },
  // Hijos de Chocolatería
  { idCategoria: 10, nombre: "Chocomensajes",      idPadre: 3 },
  { idCategoria: 11, nombre: "Chocolates Sueltos", idPadre: 3 },
  { idCategoria: 12, nombre: "Rositas",            idPadre: 3 },
  { idCategoria: 13, nombre: "Corazones",          idPadre: 3 },
]

export const productos = [
  // ── Moñas (4) ──
  { idProducto: 1,  nombreProducto: "Moño Coquette Azul Claro",       precio: 10000,  idCategoria: 4,  categoriaNombre: "Moñas",         imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382552/25_zjixrt.jpg", descripcion: "Moña artesanal en tela satinada, perfecta para cualquier ocasión.", activo: true },
  { idProducto: 2,  nombreProducto: "Moña Verde",                      precio: 10000,  idCategoria: 4,  categoriaNombre: "Moñas",         imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382552/24_gdhqbg.jpg", descripcion: "Moña artesanal en tela satinada, perfecta para cualquier ocasión.", activo: true },
  { idProducto: 3,  nombreProducto: "Moña Morada",                     precio: 10000,  idCategoria: 4,  categoriaNombre: "Moñas",         imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382552/23_dctruk.jpg", descripcion: "Moña artesanal en tela satinada, perfecta para cualquier ocasión.", activo: true },
  { idProducto: 4,  nombreProducto: "Moña Verde Oscuro",               precio: 10000,  idCategoria: 4,  categoriaNombre: "Moñas",         imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/22_b3kuy1.jpg", descripcion: "Moña artesanal en tela satinada, perfecta para cualquier ocasión.", activo: true },
  { idProducto: 5,  nombreProducto: "Moño Coquette Rosada",            precio: 10000,  idCategoria: 4,  categoriaNombre: "Moñas",         imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/20_hbyptr.jpg", descripcion: "Moña artesanal en tela satinada, perfecta para cualquier ocasión.", activo: true },
  { idProducto: 6,  nombreProducto: "Moño Coquette Marrón",            precio: 10000,  idCategoria: 4,  categoriaNombre: "Moñas",         imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/18_dlnxz9.jpg", descripcion: "Moña artesanal en tela satinada, perfecta para cualquier ocasión.", activo: true },
  // ── Moña Scrunchie (5) ──
  { idProducto: 7,  nombreProducto: "Moño Scrunchie con tulipanes Blanca con puntos de colores", precio: 10000, idCategoria: 5, categoriaNombre: "Moña Scrunchie", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/17_vlzn3i.jpg", descripcion: "Scrunchie artesanal decorada con tulipanes de tela, perfecta para un look fresco y femenino.", activo: true },
  { idProducto: 8,  nombreProducto: "Moño Scrunchie con tulipanes Negro",                        precio: 10000, idCategoria: 5, categoriaNombre: "Moña Scrunchie", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/16_xekid0.jpg", descripcion: "Scrunchie artesanal decorada con tulipanes de tela, perfecta para un look fresco y femenino.", activo: true },
  { idProducto: 9,  nombreProducto: "Moño Scrunchie con tulipanes VinoTinto",                   precio: 10000, idCategoria: 5, categoriaNombre: "Moña Scrunchie", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/13_ureb8x.jpg", descripcion: "Scrunchie artesanal decorada con tulipanes de tela, perfecta para un look fresco y femenino.", activo: true },
  { idProducto: 10, nombreProducto: "Moño Scrunchie con tulipanes Rosado",                      precio: 10000, idCategoria: 5, categoriaNombre: "Moña Scrunchie", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/15_c0u2no.jpg", descripcion: "Scrunchie artesanal decorada con tulipanes de tela, perfecta para un look fresco y femenino.", activo: true },
  { idProducto: 11, nombreProducto: "Moño Scrunchie con tulipanes Verde Oscuro",                precio: 10000, idCategoria: 5, categoriaNombre: "Moña Scrunchie", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/14_vpbftu.jpg", descripcion: "Scrunchie artesanal decorada con tulipanes de tela, perfecta para un look fresco y femenino.", activo: true },
  { idProducto: 12, nombreProducto: "Moño Scrunchie con tulipanes Blanca",                      precio: 10000, idCategoria: 5, categoriaNombre: "Moña Scrunchie", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/12_p07xc9.jpg", descripcion: "Scrunchie artesanal decorada con tulipanes de tela, perfecta para un look fresco y femenino.", activo: true },

  // ── Diademas (6) ──
  { idProducto: 13, nombreProducto: "Diadema Coquette Rosada",      precio: 10000, idCategoria: 6, categoriaNombre: "Diademas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382552/28_dxaju3.jpg", descripcion: "Diadema coquette decorada con perlas sintéticas, elegante y liviana.", activo: true },
  { idProducto: 14, nombreProducto: "Diadema Coquette Azul oscuro", precio: 10000, idCategoria: 6, categoriaNombre: "Diademas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382552/27_xlb40e.jpg", descripcion: "Diadema coquette decorada con perlas sintéticas, elegante y liviana.", activo: true },
  { idProducto: 15, nombreProducto: "Diadema Coquette Morado claro",precio: 10000, idCategoria: 6, categoriaNombre: "Diademas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382552/26_npt6w1.jpg", descripcion: "Diadema coquette decorada con perlas sintéticas, elegante y liviana.", activo: true },
  { idProducto: 16, nombreProducto: "Diadema Coquette Dorada",      precio: 10000, idCategoria: 6, categoriaNombre: "Diademas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382549/40_f93r8o.jpg", descripcion: "Diadema coquette decorada con perlas sintéticas, elegante y liviana.", activo: true },
  { idProducto: 17, nombreProducto: "Diadema Coquette Azul claro",  precio: 10000, idCategoria: 6, categoriaNombre: "Diademas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382548/39_fxrcha.jpg", descripcion: "Diadema coquette decorada con perlas sintéticas, elegante y liviana.", activo: true },
  { idProducto: 18, nombreProducto: "Diadema Coquette Negra",       precio: 10000, idCategoria: 6, categoriaNombre: "Diademas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382548/35_mlf13k.jpg", descripcion: "Diadema coquette decorada con perlas sintéticas, elegante y liviana.", activo: true },

  // ── Macetas Pequeñas (7) ──
  { idProducto: 19, nombreProducto: "Maceta Pequeña artesanal Roja y amarilla", precio: 10000, idCategoria: 7, categoriaNombre: "Macetas Pequeñas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/6_o6yt2w.jpg", descripcion: "Maceta artesenal pequeña de cemento pintada a mano.", activo: true },
  { idProducto: 20, nombreProducto: "Maceta Pequeña artesanal Roja",            precio: 10000, idCategoria: 7, categoriaNombre: "Macetas Pequeñas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/2_prxon1.jpg", descripcion: "Maceta artesenal pequeña de cemento pintada a mano.", activo: true },
  { idProducto: 21, nombreProducto: "Maceta Pequeña artesanal Azul claro",      precio: 10000, idCategoria: 7, categoriaNombre: "Macetas Pequeñas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/4_e3qddd.jpg", descripcion: "Maceta artesenal pequeña de cemento pintada a mano.", activo: true },
  { idProducto: 22, nombreProducto: "Maceta Pequeña artesanal Azul oscuro",     precio: 10000, idCategoria: 7, categoriaNombre: "Macetas Pequeñas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/3_aylzur.jpg", descripcion: "Maceta artesenal pequeña de cemento pintada a mano.", activo: true },

  // ── Macetas Grandes (9) ──
  { idProducto: 23, nombreProducto: "Maceta Grande artesanal Azul claro",        precio: 15000, idCategoria: 9, categoriaNombre: "Macetas Grandes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382551/11_iljtgz.jpg", descripcion: "Hecha completamente a mano con cemento del bueno y pintura ecológica.", activo: true },
  { idProducto: 24, nombreProducto: "Maceta Grande artesanal Negro con dorado",  precio: 15000, idCategoria: 9, categoriaNombre: "Macetas Grandes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/10_pnlstk.jpg", descripcion: "Hecha completamente a mano con cemento del bueno y pintura ecológica.", activo: true },
  { idProducto: 25, nombreProducto: "Maceta Grande artesanal Verde con dorado",  precio: 15000, idCategoria: 9, categoriaNombre: "Macetas Grandes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/9_r7qkcf.jpg", descripcion: "Hecha completamente a mano con cemento del bueno y pintura ecológica.", activo: true },
  { idProducto: 26, nombreProducto: "Maceta Grande artesanal Rojo con dorado",   precio: 15000, idCategoria: 9, categoriaNombre: "Macetas Grandes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/7_mdgxcm.jpg", descripcion: "Hecha completamente a mano con cemento del bueno y pintura ecológica.", activo: true },
  { idProducto: 27, nombreProducto: "Maceta Grande artesanal Dorado con azul",   precio: 15000, idCategoria: 9, categoriaNombre: "Macetas Grandes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382550/5_xhgv3i.jpg", descripcion: "Hecha completamente a mano con cemento del bueno y pintura ecológica.", activo: true },

  // ── Chocomensajes (10) ──
  { idProducto: 28, nombreProducto: "Chocomensaje de Amor a Mamá",          precio: 12000, idCategoria: 10, categoriaNombre: "Chocomensajes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779401346/copy_of_46_ajkqbs.jpg", descripcion: "Chocolate con mensaje personalizado de amor. ¡Sorprende a alguien especial!", activo: true },
  { idProducto: 29, nombreProducto: "Chocomensaje para el dia de la madre", precio: 12000, idCategoria: 10, categoriaNombre: "Chocomensajes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382549/45_v0vdah.jpg", descripcion: "Chocolate con mensaje personalizado de amor. ¡Sorprende a alguien especial!", activo: true },
  { idProducto: 30, nombreProducto: "Chocomensaje Para tu Mamá",            precio: 12000, idCategoria: 10, categoriaNombre: "Chocomensajes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382549/43_yfa4jk.jpg", descripcion: "Chocolate con mensaje personalizado de amor. ¡Sorprende a alguien especial!", activo: true },
  { idProducto: 31, nombreProducto: "Chocomensaje de TE AMO",               precio: 15000, idCategoria: 10, categoriaNombre: "Chocomensajes", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779399723/48_e1sbd1.jpg", descripcion: "Chocolate con mensaje personalizado de amor. ¡Sorprende a alguien especial!", activo: true },

  // ── Chocolates Sueltos (11) ──
  { idProducto: 32, nombreProducto: "Chocolate por unidad",   precio: 1000, idCategoria: 11, categoriaNombre: "Chocolates Sueltos", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779400202/49_tqecyb.jpg", descripcion: "Chocolate artesanal con mucha dedicacion y encanto.", activo: true },
  { idProducto: 33, nombreProducto: "Personaliza tu mensaje",  precio: 26000, idCategoria: 11, categoriaNombre: "Chocolates Sueltos", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779400202/50_mvhjxr.jpg", descripcion: "Chocolate artesanal con mucha dedicacion y encanto.", activo: true },

  // ── Rositas (12) ──
  { idProducto: 34, nombreProducto: "Rositas de chocolate",               precio: 5000, idCategoria: 12, categoriaNombre: "Rositas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779382549/44_ukdbvi.jpg", descripcion: "Rositas cubiertas con chocolate negro artesanal.", activo: true },
  { idProducto: 35, nombreProducto: "Rositas Pequeñas de chocolate negro", precio: 5000, idCategoria: 12, categoriaNombre: "Rositas", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779400623/53_sdueg9.jpg", descripcion: "Rositas cubiertas con chocolate negro artesanal.", activo: true },

  // ── Corazones (13) ──
  { idProducto: 36, nombreProducto: "Corazón de chocolate",          precio: 12000, idCategoria: 13, categoriaNombre: "Corazones", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779399723/47_jaiqys.jpg", descripcion: "Corazón de chocolate hecho con amor y dedicacion.", activo: true },
  { idProducto: 37, nombreProducto: "Corazónes con frase Feliz dia", precio: 15000, idCategoria: 13, categoriaNombre: "Corazones", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779400202/51_utpxu1.jpg", descripcion: "Corazónes de chocolate hecho con amor y dedicacion.", activo: true },
  { idProducto: 48, nombreProducto: "Corazón grande Feliz dia",      precio: 12000, idCategoria: 13, categoriaNombre: "Corazones", imagenUrl: "https://res.cloudinary.com/df7jz4ffk/image/upload/v1779400203/52_cx1xfg.jpg", descripcion: "Corazón de chocolate hecho con amor y dedicacion.", activo: true },
]

// Helpers
export const getCategoriaById        = (id) => categorias.find((c) => c.idCategoria === id)
export const getProductoById         = (id) => productos.find((p) => p.idProducto === Number(id))
export const getProductosByCategoria = (idCat) => productos.filter((p) => p.idCategoria === idCat && p.activo)

export const getCategoriasSinPadre = () => categorias.filter((c) => !c.idPadre)
export const getSubcategorias      = (idPadre) => categorias.filter((c) => c.idPadre === idPadre)

export const buscarProductos = (q) => {
  const lower = q.toLowerCase()
  return productos.filter(
    (p) =>
      p.activo &&
      (p.nombreProducto?.toLowerCase().includes(lower) ||
        p.categoriaNombre?.toLowerCase().includes(lower) ||
        p.descripcion?.toLowerCase().includes(lower))
  )
}