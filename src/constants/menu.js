import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "clinica",
    icon: "iconsminds-clinic",
    label: "menu.clinica.titulo",
    to: `/clinica`,
    subs: [
      {
        icon: "iconsminds-stethoscope",
        label: "menu.clinica.consultas.titulo",
        to: `/clinica/consultas`,
        roles: [UserRole.Admin, UserRole.Medico, UserRole.Enfermeria], 
      },
      {
        icon: "iconsminds-mens",
        label: "menu.clinica.pacientes.titulo",
        to: `/clinica/pacientes`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-doctor",
        label: "menu.clinica.medicos.titulo",
        to: `/clinica/medicos`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-receipt-4",
        label: "menu.clinica.servicios.titulo",
        to: `/clinica/servicios`,
        roles: [UserRole.Admin], 
      },
    ]
  },
  {
    id: "ventas",
    icon: "iconsminds-management",
    label: "menu.ventas.titulo",
    to: `/ventas`,
    subs: [
      {
        icon: "iconsminds-letter-open",
        label: "menu.ventas.facturas.titulo",
        to: `/ventas/facturas`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      },
      /*{
        icon: "iconsmind-man+woman",
        label: "menu.ventas.clientes",
        to: `/ventas/clientes`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      }*/,
      {
        icon: "iconsminds-file-horizontal",
        label: "menu.ventas.diario",
        to: `/ventas/diario`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      },
      {
        icon: "iconsminds-file-horizontal",
        label: "menu.ventas.ventascostos",
        to: `/ventas/ventascostos`,
        roles: [UserRole.Admin, UserRole.Ventas], 
      },
    ]
  },
  {
    id: "inventarios",
    icon: "iconsminds-box-close",
    label: "menu.inventarios.titulo",
    to: `/inventarios`,
    subs: [
      {
        icon: "iconsminds-tag",
        label: "menu.inventarios.productos.titulo",
        to: `/inventarios/productos`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-shopping-bag",
        label: "menu.inventarios.compras.titulo",
        to: `/inventarios/compras`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-arrow-inside",
        label: "menu.inventarios.ingresos.titulo",
        to: `/inventarios/ingresos`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-arrow-outside",
        label: "menu.inventarios.egresos.titulo",
        to: `/inventarios/egresos`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-notepad",
        label: "menu.inventarios.fisico.titulo",
        to: `/inventarios/fisico`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },
      {
        icon: "iconsminds-box-with-folders",
        label: "menu.inventarios.existencias",
        to: `/inventarios/existencias`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      }/*,
      {
        icon: "iconsminds-receipt-4",
        label: "menu.inventarios.movimientospro",
        to: `/inventarios/movimientospro`,
        roles: [UserRole.Admin, UserRole.Bodega], 
      },*/
    ]
  },
  {
    id: "ajustes",
    icon: "iconsminds-equalizer",
    label: "menu.ajustes.titulo",
    to: `/ajustes`,
    subs: [
      {
        icon: "iconsminds-on-off",
        label: "menu.ajustes.parametros",
        to: `/ajustes/parametros`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-check",
        label: "menu.ajustes.tablas",
        to: `/ajustes/tablas`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-project",
        label: "menu.ajustes.reportes",
        to: `/ajustes/reportes`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-file",
        label: "menu.ajustes.plantillas",
        to: `/ajustes/plantillas`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-building",
        label: "menu.ajustes.empresa",
        to: `/ajustes/empresa`,
        roles: [UserRole.Admin], 
      },
      {
        icon: "iconsminds-calculator",
        label: "menu.ajustes.impuestos",
        to: `/ajustes/impuestos`,
        roles: [UserRole.Admin], 
      }
    ]
  },
  {
    id: "seguridad",
    icon: "iconsminds-police",
    label: "menu.seguridad.titulo",
    to: `/seguridad`,
    subs: [
      {
        icon: "iconsminds-profile",
        label: "menu.seguridad.usuarios.titulo",
        to: `/seguridad/usuarios`,
        roles: [UserRole.Admin]
      },
      {
        icon: "iconsminds-key",
        label: "menu.seguridad.miclave",
        to: `/seguridad/miclave`,
        roles: [UserRole.Admin]
      },
      {
        icon: "iconsminds-police",
        label: "menu.seguridad.roles",
        to: `/seguridad/roles`,
        roles: [UserRole.Admin]
      }
    ]
  }
];

export default data;