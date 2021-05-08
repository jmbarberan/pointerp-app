import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir";
import tipoFactura from "@/constants/tipos";

export default function ventasRutas() {
  return [
    {
      path: traducir("rutas.facturas"),
      component: () =>
      import(/* webpackChunkName: "facturas" */ "@/views/ventas/Facturas"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
      props: { tipo: 'Facturas', tipoId: 11, rutaNuevo: 'facturas-crear', rutaModificar: 'facturas-modificar' }
    },
    {
      name: "facturas-modificar",
      path: `${traducir("rutas.facturas")}/${traducir("rutas.facturas-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "factura-modificar" */ "@/views/ventas/FacturasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      name: "facturas-crear",
      path: `${traducir("rutas.facturas")}/${traducir("rutas.facturas-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "factura-nuevo" */ "@/views/ventas/FacturasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      path: traducir("rutas.clientes"),
      component: () =>
        import(/* webpackChunkName: "clientes" */ "@/views/ventas/Clientes.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Ventas] },
    },
    {
      path: "diario",
      component: () =>
        import(/* webpackChunkName: "vdiario" */ "@/views/ventas/Diario.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "ventascosto",
      component: () =>
        import(/* webpackChunkName: "ventascostos" */ "@/views/ventas/VentasCostos.vue"),
      meta: { roles: [UserRole.Admin] },
    }
  ]
} 