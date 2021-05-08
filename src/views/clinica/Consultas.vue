<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <encabezado
          :titulo="$t('vista.clinica.consultas.lista-titulo')"
          :busquedaAtributos ="busquedaAtributos"
          :crear="crear"
          :buscar="buscar"
          :desde="desde"
          :hasta="hasta"
          :total="total"
          :xPagina="porPagina"
          :lPaginas="lPaginas"
          :cambiarPagina="cambiarPagina"
          :actualizar="actualizar"
        ></encabezado>
        <b-modal v-model="selPacienteVer" title="Seleccionar paciente" v-on:ok="seleccionadoPaciente()">
          <paciente-seleccionar/>
          <template #modal-footer="{ ok, cancel }">
            <b-button size="sm" @click="ok()" :disabled="pacienteNoSeleccionado">
              {{ $t('vista.comandos.aceptar') }}
            </b-button>
            <b-button size="sm" @click="cancel()">
              {{ $t('vista.comandos.cancelar') }}
            </b-button>
          </template>
        </b-modal>
        <b-modal v-model="selMedicoVer" title="Seleccionar medico" v-on:ok="seleccionadoMedico()">
          <medico-seleccionar/>
          <template #modal-footer="{ ok, cancel }">
            <b-button size="sm" @click="ok()" :disabled="medicoNoSeleccionado">
              {{ $t('vista.comandos.aceptar') }}
            </b-button>
            <b-button size="sm" @click="cancel()">
              {{ $t('vista.comandos.cancelar') }}
            </b-button>
          </template>
        </b-modal>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <b-table
            ref="custom-table"
            class="vuetable"
            :per-page="porPagina"
            :fields="columnas"
            :items="consultas"
            :current-page="paginaActual"
            :sort-by.sync="orden"
            :sort-desc.sync="ordenDesc"
            sort-icon-left
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <table-busy mensaje="Ejecutando consulta..." />
            </template>
            <template #cell(numero)="fila">
              <div style="text-align: center; vertical-align: middle;">
                {{ fila.item.numero }}
              </div>
            </template>
            <template #cell(acciones)="row">
              <span
                class="span-comando pt-1"
                @click="ver(row.item)"
                v-b-tooltip.hover
                title="Ver detalles"
              ><i class="mdi mdi-eye mdi-18px"/></span>
              <span v-if="row.item.estado == 0 && esMedicoEnfermero"
                class="span-comando pt-1" 
                @click="medir(row.item)"
                v-b-tooltip.hover
                title="Registrar mediciones"
              ><i class="mdi mdi-clipboard-pulse-outline mdi-18px"/></span>
              <span v-if="row.item.estado == 0 && esMedico"
                class="span-comando pt-1" 
                @click="atender(row.item)"
                v-b-tooltip.hover
                title="Iniciar atencion"
              ><i class="mdi mdi-stethoscope mdi-18px"/></span>
              <span v-if="row.item.estado == 0 && currentUser.rol_id == 1"
                class="span-comando pt-1" 
                @click="imprimirTicket(row.item)"
                v-b-tooltip.hover
                title="Imprimir ticket"
              ><i class="mdi mdi-printer mdi-18px"/></span>
              <b-dropdown
                variant="empty"
                size="xxs"
                right
                class="icono-menu-lista ml-2"
                toggle-class="header-icon icono-menu-lista"
                menu-class="position-absolute notificationDropdown"
                no-caret
              >
                <template slot="button-content">
                  <i class="boton-icono-accion mdi mdi-menu mdi-18px"/>
                  <!--span class="count">3</!--span-->
                </template>
                <b-dropdown-item v-if="row.item.factura_id <= 0 && !esMedico">
                  <span
                    class="span-comando mdi mdi-file-send-outline mdi-18px" 
                    @click="facturar(row.item)"
                  > Facturar</span>
                </b-dropdown-item>
                <b-dropdown-item v-if="row.item.estado == 0 && !esMedico">
                  <span
                    class="span-comando mdi mdi-pen mdi-18px" 
                    @click="modificar(row.item)"
                  > Modificar</span>
                </b-dropdown-item>
                <b-dropdown-item v-if="row.item.estado == 3 && esMedico">
                  <span
                    class="span-comando mdi mdi-pen mdi-18px" 
                    @click="reactivar(row.item)"
                  > Reactivar</span>
                </b-dropdown-item>
                <b-dropdown-item v-if="row.item.estado == 0 && !esMedico">
                  <span
                    class="span-comando mdi mdi-trash-can-outline mdi-18px" 
                    @click="eliminar(row.item)"
                  > Eliminar</span>
                </b-dropdown-item>
                <b-dropdown-item v-if="row.item.estado == 2 || row.item.estado == 0 && !esMedico">
                  <span
                    class="span-comando mdi mdi-update mdi-18px" 
                    @click="reprogramar(row.item)"
                  > Reprogramar</span>
                </b-dropdown-item>
              </b-dropdown>
            </template>
            <template #cell(estado)="fila">
              <b-badge :variant="$t('vista.clinica.consultas.estados.colores.' + parseInt(fila.item.estado))">{{ $t('vista.clinica.consultas.estados.' + parseInt(fila.item.estado)) }}</b-badge>
            </template>
          </b-table>
          <b-pagination
            size="sm"
            align="center"
            :total-rows="total"
            :per-page="porPagina"
            :value="paginaActual"
            v-on:change="cambiarPaginaActual($event)"
          >
            <template v-slot:next-text>
              <i class="simple-icon-arrow-right"/>
            </template>
            <template v-slot:prev-text>
              <i class="simple-icon-arrow-left"/>
            </template>
            <template v-slot:first-text>
              <i class="simple-icon-control-start"/>
            </template>
            <template v-slot:last-text>
              <i class="simple-icon-control-end"/>
            </template>
          </b-pagination>
        </b-card>
      </b-colxx>
    </b-row>
    <div id="prnTurno">
      <b-row class="medioA4 invisible">
        <b-colxx xxs="12" class="mb-5">
          <div style="background-color:#ffffff; height:660px; max-width:830px; font-family: Helvetica,Arial,sans-serif !important; position: relative;">
            <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="width:100%; background-color:#ffffff;border-collapse:separate !important; border-spacing:0;color:#242128; margin:0; padding-left:30px; padding-right:30px;" heigth="auto">
              <tbody>
                <tr>
                  <td align="left" valign="center" style="padding-bottom:0px; padding-top:10px; border-top:0;width:100% !important;">
                    <img src="@/assets/logos/black.png" />
                  </td>
                  <td align="right" valign="center" style="padding-bottom:0px;border-top:0;width:100% !important;">
                    <p style="color: #8f8f8f; font-weight: normal; line-height: 1.2; font-size: 12px; white-space: nowrap; ">
                      {{ empresa.lema }}<br> {{ empresa.direccion }}<br> {{ empresa.telefonos }}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td v-if="consultaTicket != null" align="left" valign="center" style="padding-top: 30px; padding-bottom: 30px; border-top:0; font-weight: bold; width:100% !important;">
                    TICKET DE TURNO # {{ consultaTicket.numero }}
                  </td>
                  <td v-if="consultaTicket != null" align="right" valign="center" style="padding-top: 30px; padding-bottom:30px; border-top:0; font-weight: bold; width:100% !important;">
                    FECHA: {{ $moment(consultaTicket.fecha).format("YYYY-MM-DD") }}
                  </td>
                </tr>
                <tr v-if="consultaTicket != null">
                  <td colspan="2" style="padding-bottom: 10px; padding-left: 20px">
                    Paciente: {{ consultaTicket.relPaciente.relCliente.nombres }}
                  </td>
                </tr>
                <tr v-if="consultaTicket != null">
                  <td colspan="2" style="padding-bottom: 10px; padding-left: 20px">
                    Profesional: {{ consultaTicket.relMedico.nombres }}
                  </td>
                </tr>
                <tr v-if="consultaTicket != null">
                  <td colspan="2" style="padding-bottom: 10px; padding-left: 20px">
                    Servicio medico: {{ consultaTicket.relServicio.descripcion }}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td align="right" valign="bottom" style="padding-right: 10px; width: 100% !important;">
                    ------------------------------------
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td align="center" valign="top" style="padding-right: 15px; width:100% !important;">
                    Elaborado por
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-colxx>
      </b-row>              
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EncabezadoConsultas from "@/containers/views/EncabezadoConsultas";
import PacienteSeleccionar from "@/components/Clinica/PacienteSeleccionar";
import MedicoSeleccionar from "@/components/Clinica/MedicoSeleccionar";
import { slogan } from "@/constants/config";
export default {
  components: {
    "encabezado": EncabezadoConsultas,
    "paciente-seleccionar": PacienteSeleccionar,
    "medico-seleccionar": MedicoSeleccionar
  },
  data() {
    return {
      orden: 'fecha',
      ordenDesc: true,
      porPagina: 10,
      paginaActual: 1,
      lPaginas: [ 5, 10, 15, 20 ],
      desde: 0,
      hasta: 0,
      columnas: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: "Turno", 
          key: "numero",
          sortable: true
        },
        { 
          label: this.$t("vista.clinica.consultas.campos.paciente"), 
          key: "relPaciente.relCliente.nombres",
          sortable: true
        },
        { 
          label: this.$t("vista.clinica.consultas.campos.medico"), 
          key: "relMedico.nombres",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.fecha"), 
          key: "fecha", 
          sortable: true 
        },
        {
          label: this.$t("vista.clinica.consultas.campos.especialidad"),
          key: "relServicio.relEspecialidad.descripcion",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.servicio"),
          key: "relServicio.descripcion",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.estado"),
          key: "estado",
          sortable: true
        },
        {
          label: this.$t("vista.clinica.consultas.campos.factura"),
          key: "factura_id",
          sortable: true
        }
      ],
      consultas: [], 
      busquedaAtributos: [
        this.$t("vista.ventas.clientes.campos.nombres"),
        this.$t("vista.ventas.clientes.campos.cedula"),
        this.$t("vista.ventas.clientes.campos.codigo")
      ],
      busquedaEjecutando: false,
      selPacienteVer: false,
      selMedicoVer: false,
      consultaTicket: null
    }
  },
  computed: {
    ...mapGetters("clinica", [
      "selPaciente",
      "selMedico",
      "buscaConsultaTipo",
      "buscaConsultaDesde",
      "buscaConsultaHasta"
    ]),
    ...mapGetters([
      'currentUser'
    ]),
    esMedico() {
      return this.currentUser != undefined ? this.currentUser.rol_id-1 == 4 : false;
    },
    esMedicoEnfermero() {
      return this.currentUser != undefined ? this.currentUser.rol_id-1 >= 4 : false;
    },
    total() {
      if (!this.busquedaEjecutando) {
        return this.consultas.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina)
    },
    pacienteNoSeleccionado() {
      return this.selPaciente == null;
    },
    medicoNoSeleccionado() {
      return this.selMedico == null;
    },
    empresa() {
      return {
        direccion: this.$store.state.empresaAccedida.direccion,
        telefonos: this.$store.state.empresaAccedida.telefonos,
        lema: slogan
      };
    },
  },
  methods: {
    cambiarPagina(p) {
      this.porPagina = p;
    },
    cambiarPaginaActual(e) {
      if (this.total == 0) {
        this.desde = 0;
      } else {
        if (e == 1) {
          this.desde = e;
        } else {
          this.desde = ((e - 1) * this.porPagina) + 1;
        };
      }
      if (this.total == 0) {
        this.hasta = 0;
      } else {
        if (e == this.paginas) {
          this.hasta = this.total;
        } else {
          this.hasta = (this.desde - 1) + this.porPagina;
        }
      }
      this.paginaActual = e;
    },
    actualizar() {
      if (this.esMedico && this.$store.state.clinica.medicoUsuario > 0) {
        this.busquedaMedico();
      } else {
        switch (this.buscaConsultaTipo) {
          case 0 : {
            this.seleccionadoPaciente();
            break;
          }
          case 1 : {
            if (this.buscaConsultaDesde != null && this.buscaConsultaHasta != null) {
              this.buscarPorFecha();
            } else {
              this.$notify("warning", 
                "Buscar consultas medicas", 
                "Debe seleccionar el perdiodo a consultar para ejecutar esta busqueda.", 
                { duration: 3000, permanent: false }
              );
            }
            break;
          }
          case 2 : {
            this.seleccionadoMedico();
            break;
          }
          case 4 : {
            // Hoy
            this.iniciarFechasHoy();
            this.buscarPorFecha();
            break;
          }
        }
      }
      
    },
    buscar() {
      if (this.esMedico > 0 && this.$store.state.clinica.medicoUsuario > 0) {
          this.busquedaMedico();
        } else {

          switch (this.buscaConsultaTipo) {
            case 0 : {
              this.selPacienteVer = true;
              break;
            }
            case 2 : {
              // buscar medico
              this.selMedicoVer = true;
              break;
            }
          }
        }
    },
    ver(p) {
      this.abrirEditor("consultas-atender", p.id, p, true);
    },
    crear() {
      this.abrirEditor("consultas-crear", 0, null, false);
    },
    modificar(p) {
      this.abrirEditor("consultas-modificar", p.id, p, false);
    },
    facturar(p) {
      let fac = {
        id: 0,
        tipo: 11,
        numero: 0,
        fecha: p.fecha,
        sucursal_id: p.sucursal_id,
        plazo: 0,
        cliente_id: p.relPaciente.relCliente.id,
        vendedor_id: 1,
        observaciones: "FACTURA DE CONSULTA MEDICA",
        descuento_porcentaje: 0,
        porcentaje_venta: 0, // Rect
        subtotal: 0, 
        subtotalex: 0, 
        descuento: 0, 
        recargo: 0, 
        flete: 0, 
        impuestos: 0, 
        abonos: 0, 
        estado: 0,
        especie: p.id, // Consulta
        movimiento_id: 1, // Bodega 
        ecomprobante_id: 0, 
        operador: '',
        relCliente: p.relPaciente.relCliente,
        relItems: [],
      }
      if (p.relServicio.relProducto != undefined) {
        let item = {
          id: 0,
          venta_id: 0,
          movitem_id: 1,
          producto_id: p.relServicio.relProducto.id,
          cantidad: 1,
          pedido: 0,
          precio: p.relServicio.relProducto.precio,
          costo: 0,
          descuento: 0,
          adicional: 0,
          observacion: '',
          presentacion_id: 0, 
          lote_id: 0,
          relProducto: p.relServicio.relProducto
        }
        fac.relItems.push(item);
      }

      let valServ = p.relServicio.valor;
      this.$router.push({
        name: 'facturas-crear',
        params: {
          id: 0,
          dato: fac,
          tipo: "Factura",
          tipoId: 11,
          lectura: false,
          servicioValor: valServ,
        }
      });
      // insertar el producto del servicio
    },
    medir(p) {
      this.abrirEditor("consultas-mediciones", p.id, p, false);
    },
    atender(p) {
      this.abrirEditor("consultas-atender", p.id, p, false);
    },
    reactivar(p) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("clinica/consultasGuardarEstado", { 
          id: p.id,
          estado: 0
         })
        .then(function(r) {
          if (r.data.msj != null)
            this.$notify("success", "Reactivar consulta", r.data.msj, { duration: 3000, permanent: false });
          this.buscar();  
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning", "Reactivar profesional", "No se pudo reactivar esta consulta.", { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false; 
    },
    eliminar(p) {
      this.busquedaEjecutando = true;
      this.$store
        .dispatch("clinica/consultasGuardarEstado", { 
          id: p.id,
          estado: 2
         })
        .then(function(r) {
          if (r.data.msj != null)
            this.$notify("success", "Eliminar consulta", "La consulta se elimino exitosamente", { duration: 3000, permanent: false });
          this.buscar();
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.$notify("warning", "Eliminar profesional", "No se pudo eliminar esta consulta.", { duration: 3000, permanent: false });
        }.bind(this));
      this.busquedaEjecutando = false; 
    },
    abrirEditor(ruta, pid, psel, lec) {
      this.$store.commit('clinica/setBuscaConsultaListaCache', this.consultas);
      this.$router.push({
        name: ruta,
        params: {
          id: pid,
          dato: psel,
          lectura: lec
        }
      });
    },
    seleccionadoPaciente() {
      if (this.selPaciente != null) {
        this.busquedaEjecutando = true;
        this.$store.commit("clinica/setBuscaConsultaPaciente", this.selPaciente.id);
        this.consultas = [];
        this.paginaActual = 1;
        let p = {
          tipo: 0,
        }
        this.$store
          .dispatch("clinica/buscarConsultasPersona", p)
          .then(function(r) {
            if (r.id == 1) {
              if (r.respuesta.data != undefined) {
                this.consultas = r.respuesta.data;
              }
            }
            this.busquedaEjecutando = false;
            if (this.consultas.length <= 0) {
              this.$notify(
                "warning", 
                "Buscar consultas", 
                "No se encontraron resultados para esta busqueda.", 
                { duration: 3000, permanent: false }
              );
            } else {
              this.paginaActual = 1;
              this.cambiarPaginaActual(1);
            }
          }.bind(this))
          .catch(function() {
            this.busquedaEjecutando = false;
            this.$notify("warning", "Buscar consultas", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false});
          }.bind(this));
      }
    },
    seleccionadoMedico() {
      if (this.selMedico != null) {
        this.busquedaEjecutando = true;
        this.consultas = [];
        this.paginaActual = 1;
        this.$store
          .dispatch("clinica/buscarConsultasMedicoFecha", this.selMedico.id)
          .then(function(r) {
            if (r.id == 1) {
              if (r.respuesta != undefined) {
                this.consultas = r.respuesta;
              }
            }
            this.busquedaEjecutando = false;
            if (this.consultas.length <= 0) {
              this.$notify("warning", "Buscar consultas", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false });
            } else {
              this.paginaActual = 1;
              this.cambiarPaginaActual(1);
            }
          }.bind(this))
          .catch(function(e) {
            console.log(e);
            this.busquedaEjecutando = false;
            this.$notify("warning", "Buscar consultas", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false });
          }.bind(this));
      }
    },
    busquedaMedico() {
      this.busquedaEjecutando = true;
      this.consultas = [];
      this.paginaActual = 1;
      this.$store
        .dispatch("clinica/buscarConsultasMedicoFecha", this.$store.state.clinica.medicoUsuario)
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta != undefined) {
              this.consultas = r.respuesta;
            }
          }
          this.busquedaEjecutando = false;
          if (this.consultas.length <= 0) {
            this.$notify("warning", "Buscar paciente", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false });
          } else {
            this.paginaActual = 1;
            this.cambiarPaginaActual(1);
          }
        }.bind(this))
        .catch(function(e) {
          console.log(e);
          this.busquedaEjecutando = false;
          this.$notify("warning", "Buscar paciente", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false });
        }.bind(this));
    },
    buscarPorFecha() {
      this.busquedaEjecutando = true;
      this.consultas = [];
      this.paginaActual = 1;
      this.$store
          .dispatch("clinica/buscarConsultasFecha")
          .then(function(r) {
            if (r.id == 1) {
              if (r.respuesta.data != undefined) {
                this.consultas = r.respuesta.data;
              }
            }
            if (this.consultas.length <= 0) {
              this.$notify("warning", "Buscar paciente", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false });
            } else {
              this.paginaActual = 1;
              this.cambiarPaginaActual(1);
            }
            this.busquedaEjecutando = false;
          }.bind(this))
          .catch(function(e) {
            this.busquedaEjecutando = false;
            this.$notify("warning", "Buscar paciente", "No se encontraron resultados para esta busqueda.", { duration: 3000, permanent: false });
          }.bind(this));
    },
    iniciarFechasHoy() {
      let hoy = new Date();
      this.$store.commit("clinica/setBuscaConsultaDesde", hoy);
      this.$store.commit("clinica/setBuscaConsultaHasta", hoy);
    },
    imprimirTicket(p) {
      this.consultaTicket = p;
      this.$htmlToPaper("prnTurno");
      this.consultaTicket = null;
    },
  },
  created(){
    this.$store
      .dispatch("clinica/medicoPorUsuario", this.currentUser.id)
      .then(function(r) {
        if (r.id == 1) {
          if (r.respuesta.data != undefined && r.respuesta.data.length > 0) {
            this.$store.commit("clinica/setMedicoUsuario", r.respuesta.data[0].id);
          }
        }
      }.bind(this));
  },
  mounted() {
    if (this.$store.state.clinica.consultaBuscador.listaCache.length > 0) {
      this.consultas = this.$store.state.clinica.consultaBuscador.listaCache;
      this.$store.commit('clinica/setBuscaConsultaListaCache', []);
    } else {
      if (this.esMedico) {
        this.busquedaMedico();
      }
    }
    if (this.$store.state.clinica.consultaBuscador.cacheAtributo.length > 0) {
      this.$store.commit('clinica/setBuscaConsultaAtributo', this.$store.state.clinica.consultaBuscador.cacheAtributo);
      this.$store.commit('clinica/setCacheBusquedaConsultasAtributo', '');
    } else {
      this.$store.commit("clinica/setBuscaConsultaAtributo", "Nombre");
    }
    if (this.$store.state.clinica.consultaBuscador.cacheAtributoIdx > 0) {
      this.$store.commit('clinica/setBuscaConsultaAtributoIdx', this.$store.state.clinica.consultaBuscador.cacheAtributoIdx);
      this.$store.commit('clinica/setCacheBusquedaConsultasAtributoIdx', 0);
    }
    if (this.buscaConsultaDesde == null)
      this.$store.commit('clinica/setBuscaConsultaDesde', new Date());
    if (this.buscaConsultaHasta == null)  
      this.$store.commit('clinica/setBuscaConsultaHasta', new Date());
  },
  destroyed() {
    this.$store.commit('clinica/setBuscaConsultaListaCache', this.consultas);
    if (this.$store.state.clinica.consultaBuscador.atributo.length > 0) {
      this.$store.commit('clinica/setCacheBusquedaConsultasAtributo', this.$store.state.clinica.consultaBuscador.atributo);
      this.$store.commit('clinica/setBuscaConsultaAtributo', '');
    }
    if (this.$store.state.clinica.consultaBuscador.atributoIdx > 0) {
      this.$store.commit('clinica/setCacheBusquedaConsultasAtributoIdx', this.$store.state.clinica.consultaBuscador.atributoIdx);
      this.$store.commit('clinica/setBuscaConsultaAtributoIdx', 0);
    }
  }
}
</script>