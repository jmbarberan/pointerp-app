let rutaBase = "/maestros";

export const clientePorCedula = function(ced) {
  return `${rutaBase}/clientes/cedula/${ced}`;
};

export const clientesPorNombre = function(estado, filtro, emp) {
  return `${rutaBase}/clientes/estado/${estado}/filtro/${filtro}/emp/${emp}/buscar`;
};