import Vue from "vue";
import VueRouter from "vue-router";
//import AuthGuard from "@/utils/auth.guard";
import { UserRole } from "@/utils/auth.roles";
import traducir from "@/utils/traducir.js";
import clinicaRutas from "@/router/modulos/clinica";
import ventasRutas from "@/router/modulos/ventas";
import inventariosRutas from "@/router/modulos/inventarios";
import ajustesRutas from "@/router/modulos/ajustes";
import seguridadRutas from "@/router/modulos/seguridad"; 

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "root" */ "@/views/vista"),
    redirect: `${traducir("rutas.inicio")}`,
    meta: { loginRequired: true },
    children: [ 
      {
        path: traducir("rutas.inicio"),
        component: () =>
          import(/* webpackChunkName: "inicio" */ "@/views/Inicio.vue"),
      },
      {
        path: traducir("rutas.clinica"),
        component: () =>
          import(/* webpackChunkName: "clinica" */ "@/views/clinica"),
        redirect: `${traducir("rutas.clinica")}/${traducir("rutas.consultas")}`,
        meta: { roles: [UserRole.Admin, UserRole.Medico, UserRole.Enfermeria] },
        children: clinicaRutas()
      },
      {
        path: traducir("rutas.ventas"),
        component: () =>
          import(/* webpackChunkName: "ventas" */ "@/views/ventas"),
        redirect: `${traducir("rutas.ventas")}/${traducir("rutas.facturas")}`,
        meta: { roles: [UserRole.Admin, UserRole.Ventas] },
        children: ventasRutas()
      },
      {
        path: traducir("rutas.inventarios"),
        component: () =>
        import(/* webpackChunkName: "inventarios" */ "@/views/inventarios"),
        redirect: `${traducir("rutas.inventarios")}/existencias`,
        meta: { roles: [UserRole.Admin, UserRole.Bodega] },
        children: inventariosRutas()
      },
      {
        path: traducir("rutas.ajustes"),
        component: () =>
          import(/* webpackChunkName: "ajustes" */ "@/views/ajustes"),
        redirect: `${traducir("rutas.ajustes")}/parametros`,
        meta: { roles: [UserRole.Admin] },
        children: ajustesRutas()
      },
      {
        path: traducir("rutas.seguridad"),
        component: () =>
          import(/* webpackChunkName: "seguridad" */ "@/views/seguridad"),
        redirect: `${traducir("rutas.seguridad")}/usuarios`,
        meta: { roles: [UserRole.Admin, UserRole.Editor] },
        children: seguridadRutas()
      }
    ],
  },
  {
    path: "/error",
    component: () => import(/* webpackChunkName: "error" */ "@/views/Error")
  },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "error" */ "@/views/Error")
  },
  {
    path: `/${traducir("rutas.usuario")}`,
    component: () => import(/* webpackChunkName: "user" */ "@/views/user"),
    redirect: `/${traducir("rutas.usuario")}/${traducir("rutas.acceder")}`,
    children: [ // seguridadRutas.frontend()
      {
        path: traducir("rutas.acceder"),
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/Login")
      },
      {
        path: "register",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/Register")
      },
      {
        path: "forgot-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/ForgotPassword")
      },
      {
        path: "reset-password",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/ResetPassword")
      },
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history",
});

export default router
