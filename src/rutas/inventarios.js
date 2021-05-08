import { app } from "@/main";
let rutaBase = "/inventarios";

export const productosBuscar = function(emp, tipo, atrib, estado, filtro) {
  return `${rutaBase}/productos/emp/${emp}/tipo/${tipo}/estado/${estado}/atributo/${atrib}/filtro/${filtro}/buscar`;
};
export const productoExistencias = function(id, bodega) {
  return `${rutaBase}/productos/${id}/bodega/${bodega}/existencia`;
};
export const productoRegistrado = function(id, cod, nom) {
  return `${rutaBase}/productos/${id}/existe/${cod}/nombre/${nom}`;
};
export const productoGuardar = function() {
  return `${rutaBase}/productos/guardar`;
}
export const productoModificarEstado = function(id, estado) {
  return `${rutaBase}/productos/${id}/modificar/estado/${estado}`
}

export const existenciasTodos = function(bodega) {
  return `${rutaBase}/productos/bodega/${bodega}/existencia`;
};

export const existenciasCeroTodos = function(bodega, zeros) {
  return `${rutaBase}/productos/bodega/${bodega}/existencia/ceros/${zeros}`;
};

// Movimientos de inventarios
export const  movimientoPorId = function(id) {
  return `${rutaBase}/movimientos/${id}`;
};

export const movimientosBuscar = function(tipo, filtro, estado, desde, hasta, clase, bodega) {
  return `${rutaBase}/movimientos/bodega/${bodega}/clase/${clase}/estado/${estado}/desde/${desde}/hasta/${hasta}/tipo/${tipo}/filtro/${filtro}/buscar`;
}

export const movimientoModificarEstado = function(id, estado) {
  return `${rutaBase}/movimientos/${id}/modificar/estado/${estado}`;
}

export const movimientosGuardar = function() {
  return `${rutaBase}/movimientos/guardar`;
}

// Bodegas
export const bodegasPorEstado = function(est) {
  return `${rutaBase}/bodegas/estado/${est}`;
};
