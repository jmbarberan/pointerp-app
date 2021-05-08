import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir";

export default function inventariosRutas() {
  return [
    {
      path: `${traducir("rutas.compras")}`,
      component: () =>
      import(/* webpackChunkName: "compra" */ "@/views/inventarios/Compras.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "compras-modificar",
      path: `${traducir("rutas.compras")}/${traducir("rutas.compras-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "compras-modificar" */ "@/views/inventarios/ComprasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "compras-crear",
      path: `${traducir("rutas.compras")}/${traducir("rutas.compras-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "compras-crear" */ "@/views/inventarios/ComprasEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: `${traducir("rutas.bingresos")}`,
      component: () =>
      import(/* webpackChunkName: "bingresos" */ "@/views/inventarios/Movimientos.vue"),
      props: { tipo: 'Ingresos a Bodega', tipoId: 6, rutaNuevo: 'ingresos-crear', rutaModificar: 'ingresos-modificar' },
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "ingresos-modificar",
      path: `${traducir("rutas.bingresos")}/${traducir("rutas.bingresos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "bingresos-modificar" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "ingresos-crear",
      path: `${traducir("rutas.bingresos")}/${traducir("rutas.bingresos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "bingresos-crear" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: `${traducir("rutas.begresos")}`,
      component: () =>
      import(/* webpackChunkName: "begresos" */ "@/views/inventarios/Movimientos.vue"),
      props: { tipo: 'Egresos a Bodega', tipoId: 7, rutaNuevo: 'egresos-crear', rutaModificar: 'egresos-modificar' },
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "egresos-modificar",
      path: `${traducir("rutas.begresos")}/${traducir("rutas.begresos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "begresos-modificar" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "egresos-crear",
      path: `${traducir("rutas.begresos")}/${traducir("rutas.begresos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "begresos-crear" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: `${traducir("rutas.fisico")}`,
      component: () =>
      import(/* webpackChunkName: "ifisico" */ "@/views/inventarios/Movimientos.vue"),
      props: { tipo: 'Inventario fisico', tipoId: 8, rutaNuevo: 'fisico-crear', rutaModificar: 'fisico-modificar' },
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "fisico-modificar",
      path: `${traducir("rutas.fisico")}/${traducir("rutas.fisico-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "fisico-modificar" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "fisico-crear",
      path: `${traducir("rutas.fisico")}/${traducir("rutas.fisico-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "fisico-crear" */ "@/views/inventarios/MovimientosEditor.vue"),
      meta: { roles: [UserRole.Admin] },
    },
    {
      path: "productos",
      component: () =>
        import(/* webpackChunkName: "productos" */ "@/views/inventarios/Productos.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "productos-modificar",
      path: `${traducir("rutas.productos")}/${traducir("rutas.productos-modificar")}`,
      component: () =>
        import(/* webpackChunkName: "medicos-modificar" */ "@/views/inventarios/ProductosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      name: "productos-crear",
      path: `${traducir("rutas.productos")}/${traducir("rutas.productos-nuevo")}`,
      component: () =>
        import(/* webpackChunkName: "medicos-crear" */ "@/views/inventarios/ProductosEditor.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: "existencias",
      component: () =>
        import(/* webpackChunkName: "existencias" */ "@/views/inventarios/Existencias.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    },
    {
      path: "movimientospro",
      component: () =>
        import(/* webpackChunkName: "movimientospro" */ "@/views/inventarios/Movimientospro.vue"),
      meta: { roles: [UserRole.Admin, UserRole.Bodega] },
    }
  ];
}