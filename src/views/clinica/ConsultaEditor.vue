<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('vista.clinica.consultas.editor-titulo')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
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
  <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.clinica.consultas.datos-paciente') }}</h6>
            <b-form class="av-tooltip mb-5 tooltip-label-right">
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.tipo-identificacion')">
                    <b-form-select v-model="consulta.relPaciente.relCliente.identificacion_tipo"
                      :options="tiposIdentificacion"
                      value-field="id"
                      text-field="denominacion"
                      size="xs"
                    />
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                    <div>
                      <b-overlay :show="ocupadoCedula" rounded="lg" opacity="0.6">
                        <template #overlay>
                          <div class="d-flex align-items-center">
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <b-spinner type="grow" variant="dark"></b-spinner>
                            <b-spinner small type="grow" variant="secondary"></b-spinner>
                            <!-- We add an SR only text for screen readers -->
                            <span class="sr-only">Espere por favor...</span>
                          </div>
                        </template>
                        <b-form-input type="text" v-model.trim="consulta.relPaciente.relCliente.identificacion" @keyup.enter="validarCedula()"/>
                      </b-overlay>
                    </div>  
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                    <b-form-input ref="txNombre" type="text" v-model="nombrePaciente" :state="!$v.consulta.relPaciente.relCliente.nombres.$error" @keyup.enter="buscarPaciente()"/>
                    <b-form-invalid-feedback>{{ $t('vista.clinica.consultas.validacion.paciente') }}</b-form-invalid-feedback>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                    <b-form-input type="text" v-model.trim="consulta.relPaciente.relCliente.direccion"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                    <b-form-input type="text" v-model.trim="consulta.relPaciente.relCliente.telefonos"/>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                    <b-form-input type="text" v-model.trim="consulta.relPaciente.relCliente.email"/>
                  </b-form-group>
                </b-colxx>
              </b-row>
              <h6 class="mb-4">{{ $t('vista.clinica.consultas.datos-consulta') }}</h6>
              <b-row>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.especialidad')">
                    <model-list-select 
                      :list="especialidades"
                      v-model="especialidadSeleccionado"
                      option-value="id"
                      option-text="descripcion">
                    </model-list-select>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.servicio')">
                    <b-overlay :show="ocupadoServicio" rounded="lg" opacity="0.6">
                      <template #overlay>
                        <div class="d-flex align-items-center">
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <b-spinner type="grow" variant="dark"></b-spinner>
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <span class="sr-only">Espere por favor...</span>
                        </div>
                      </template>
                      <model-list-select 
                        :list="servicios"
                        v-model="servicioSeleccionado"
                        option-value="id"
                        option-text="descripcion">
                      </model-list-select>
                    </b-overlay>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label="$t('vista.clinica.consultas.campos.medico')">
                    <model-list-select
                      :list="medicos"
                      v-model="medicoSeleccionado"
                      option-value="id"
                      option-text="nombres">
                    </model-list-select>
                  </b-form-group>
                </b-colxx>
                <b-colxx xxs="12" sm="6">
                  <b-form-group :label='$t("vista.clinica.consultas.campos.fecha")'>
                    <datepicker
                      class="fecha-md"
                      :bootstrap-styling="true"
                      v-model="fechaSeleccionado"
                      :language="es"
                    ></datepicker>  
                  </b-form-group>
                </b-colxx>
              </b-row>
              <b-row>
                <b-colxx xxs="12" sm="12">
                  <b-alert :show="alerta.ver" :variant="alerta.tipo" class="mt-4">{{ alerta.mensaje }}</b-alert>
                </b-colxx>  
              </b-row>
              <div class="mt-4">
                <b-overlay
                  :show="procesando"
                  opacity=0.6
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                  @hidden="ocultaOverlay"
                >
                  <b-button ref="btGuardar" :disabled="procesando" @click="guardar(false)" variant="success" class="mr-3 mb-3">{{ $t('vista.comandos.guardar') }}</b-button>
                </b-overlay>
                <b-overlay
                  :show="procesando" 
                  opacity=0.6
                  spinner-small
                  spinner-variant="primary"
                  class="d-inline-block"
                  @hidden="ocultaOverlay"
                >
                  <b-button v-if="consulta.id <= 0" ref="btGuardarFac" :disabled="procesando" @click="guardar(true)" variant="success" class="mr-3 mb-3">{{ $t('vista.comandos.guardar-facturar') }}</b-button>
                </b-overlay>  
                <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="mb-3">{{ $t('vista.comandos.cancelar') }}</b-button>
              </div>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
const { required } = require("vuelidate/lib/validators");
import * as moment from 'moment';
import Datepicker from "vuejs-datepicker";
import {es} from 'vuejs-datepicker/dist/locale'
import { ModelListSelect } from 'vue-search-select'
import { mapGetters } from 'vuex';
import PacienteSeleccionar from "@/components/Clinica/PacienteSeleccionar";
export default {
  components: {
    ModelListSelect,
    Datepicker,
    "paciente-seleccionar": PacienteSeleccionar
  },
  data: function () {
    return {
      es: es,
      consulta: {
        id: 0,
        sucursal_id: 1,
        paciente_id: 0,
        medico_id: 0,
        fecha: null,
        servicio_id: 0,
        hora: "",
        motivo: "",
        estado: 0,
        relMedico: {
          id: 0,
          nombres: ""
        },
        relServicio: {
          id: 0,
          descripcion: ""
        },
        relPaciente: {
          id: 0,
          cliente_id: 0,
          fecha_nacimiento: null,
          sexo: 0,
          estado_civil: 0,
          instruccion: 0,
          grupo_sanguineo: 0,
          foto: "",
          alergias: "",
          antecedentes_familiares: "",
          antecedentes_personales: "",
          estado: 0,
          relCliente: {
            id: 0,
            empresa_id: 0,
            codigo: "",
            identificacion: "",
            identificacion_tipo: 0,
            nombres: "",
            direccion: "",
            telefonos: "",
            representante_nom: "",
            representante_ced: "",
            email: "",
            cupo: 0,
            estado: 0,
            relIdentificaTipo: null
          }
        }  
      },
      especialidades: [],
      servicios: [],
      medicos: [],
      especialidadSel: 0,
      tiposIdentificacion: [],
      procesando: false,
      ocupadoCedula: false,
      ocupadoServicio: false,
      alerta: {
        ver: false,
        tipo: "info",
        mensaje: ""
      },
      selPacienteVer: false
    }
  },
  validations: {
    consulta: {
      relPaciente: {
        relCliente: {
          nombres: {
            required
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters("clinica", [
      "selPaciente",
      'selPacienteTexto'
    ]),
    tituloAccion: function() {
      let res = this.$t('menu.clinica.consultas.nuevo');
      if (this.consulta.id > 0) 
        res = this.$t('menu.clinica.consultas.modificar');
      return res;  
    },
    fechaSeleccionado: {
      get: function() {
        return this.$moment(this.consulta.fecha).toDate();
      },
      set: function(v) {
        this.consulta.fecha = v;
      }
    },
    especialidadSeleccionado: {
      get: function() {
        return this.especialidadSel;
      },
      set: function(v) {
        this.especialidadSel = v;
        this.cambiarEspecialidad();
      }
    },
    servicioSeleccionado: {
      get: function() {
        return this.consulta.servicio_id;
      },
      set: function(v) {
        this.consulta.servicio_id = v;
        this.consulta.relServicio = this.servicios.find(x => x.id == v);
      }
    },
    medicoSeleccionado: {
      get: function() {
        return this.consulta.medico_id;
      },
      set: function(v) {
        this.consulta.medico_id = v;
      }
    },
    pacienteNoSeleccionado() {
      return this.selPaciente == null;
    },
    nombrePaciente: {
      get () {
        return this.selPacienteTexto;
      },
      set (value) {
        this.$store.commit('clinica/setSelPacienteTexto', value);
      }
    },
  },
  methods: {
    guardar(fac) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify(
          "warning",
          "No se puede guardar",
          "Revise los mensajes de validacion para poder continuar.",
          { duration: 3000, permanent: false }
        );
      } else {
        // TODO (parametrizar validacion)
        let val = true;
        let msj = "";

        val = val && this.consulta.servicio_id > 0
        if (!val) {
          msj += "Servicio medico";
        }

        val = val && this.consulta.medico_id > 0
        if (!val) {
          msj += (msj.length > 0 ? ", " : "") + "Profesional"; 
        }

        val = val && this.consulta.fecha != undefined
        if (!val) {
          msj += (msj.length > 0 ? ", " : "") + "Fecha";
        }

        if (val) {
          this.procesarGuardado(fac);
        } else {
          this.$notify(
            "warning",
            "No se puede guardar",
            "Estos campos son requeridos: " + msj,
            { duration: 3000, permanent: false }
          );

        }
      }
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.go(-1);
    },
    validarCedula() {
      this.ocupadoCedula = true;
      this.$store
        .dispatch("clinica/pacientePorCedula", this.consulta.relPaciente.relCliente.identificacion)
        .then(function(r) {
          if (r.status == 200) {
            if (r.data.res) {
              if (r.data.data != undefined) {
                this.consulta.relPaciente = r.data.data;
                this.$store.commit('clinica/setSelPacienteTexto', r.data.data.relCliente.nombres);
              }
            } else {
              if (r.data.cid > 0) {
                this.consulta.relPaciente.relCliente.id = r.data.data;
                this.relPaciente.id = 0;
                this.nombrePaciente = r.data.data.relCliente.nombres;
                if (r.data.data != undefined) {
                  this.alerta.mensaje = "La cedula esta la base de datos pero no esta registrado como paciente, se creara un registro nuevo";
                  this.alerta.tipo = "warning";
                  this.alerta.ver = true;
                  this.consulta.relPaciente.relCliente = r.data.data;
                }
              }
            }
          }
          this.ocupadoCedula = false;
        }.bind(this))
        .catch(function(e) {
          this.ocupadoCedula = false;
        }.bind(this));
    },
    procesarGuardado(fac) {
      if (this.consulta.relPaciente != undefined)
        this.consulta.paciente_id = this.consulta.relPaciente.id;

      this.$store
        .dispatch("clinica/consultaGuardar", this.consulta)
        .then(function(res) {
          if (res.estatus <= 201) {
            if (fac) {
              this.guardarfac(res.data.cid);
            } else {
              this.$router.go(-1);
            }
          } else {
            if (fac) {
              this.guardarfac(res.data.cid);
            }
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          console.log(e);
          this.procesando = false;
          let msj = "No se puede guardar por error relacionado al servidor";
          this.$notify(
            "danger", 
            "Guardar Consulta", 
            msj,
            { duration: 3000, permanent: false }
          );
        }.bind(this));
    },
    guardarfac(cid) {
      let fac = {
        id: 0,
        tipo: 11,
        numero: 0,
        fecha: this.consulta.fecha,
        sucursal_id: this.consulta.sucursal_id,
        plazo: 0,
        cliente_id: this.consulta.relPaciente.relCliente.id,
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
        especie: cid, // Consulta
        movimiento_id: 1, // Bodega 
        ecomprobante_id: 0, 
        operador: '',
        relCliente: this.consulta.relPaciente.relCliente,
        relItems: [],
      }
      if (this.consulta.relServicio.relProducto != undefined) {
        let item = {
          id: 0,
          venta_id: 0,
          movitem_id: 1,
          producto_id: this.consulta.relServicio.relProducto.id,
          cantidad: 1,
          pedido: 0,
          precio: this.consulta.relServicio.relProducto.precio,
          costo: 0,
          descuento: 0,
          adicional: 0,
          observacion: '',
          presentacion_id: 0, 
          lote_id: 0,
          relProducto: this.consulta.relServicio.relProducto
        }
        fac.relItems.push(item);
      }

      let valServ = this.consulta.relServicio.valor;
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
    cambiarEspecialidad() {
      // Actualizar lista de servicio por especialidad
      this.ocupadoServicio = true;
      this.$store
        .dispatch("clinica/serviciosEspecialidad", this.especialidadSel)
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta != null) {
              this.servicios = r.respuesta.data;
            }
          }
          this.ocupadoServicio = false;
        }.bind(this))
        .catch(function(e) {
          this.ocupadoServicio = false;
        }.bind(this));
    },
    seleccionadoPaciente() {
      this.consulta.relPaciente = this.selPaciente;
      this.nombrePaciente = this.selPaciente.relCliente.nombres;
      this.$refs.txNombre.$el.value = this.selPaciente.relCliente.nombres;
    },
    buscarPaciente() {
      this.selPacienteVer = true;
    }
  },
  mounted() {
    this.$store
      .dispatch("clinica/especialidadesTodas")
      .then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.especialidades = r.respuesta.data;
          }
        }
      }.bind(this));

    this.$store
      .dispatch("clinica/medicosPorEstado", 0)
      .then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.medicos = r.respuesta.data;
          }
        }
      }.bind(this));

    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 12 // Tipos de identificacion
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.tiposIdentificacion = r.respuesta.data;
          }
        }
      }.bind(this));

    if (this.$route.params.id > 0) {
      this.consulta = this.$route.params.dato;
      if(this.$route.params.dato.relPaciente == undefined) {
        this.consulta.relPaciente = {
          relPaciente: {
            id: 0,
            cliente_id: 0,
            fecha_nacimiento: null,
            sexo: 0,
            estado_civil: 0,
            instruccion: 0,
            grupo_sanguineo: 0,
            foto: "",
            alergias: "",
            antecedentes_familiares: "",
            antecedentes_personales: "",
            estado: 0,
            relCliente: {
              id: 0,
              empresa_id: 0,
              codigo: "",
              identificacion: "",
              identificacion_tipo: 0,
              nombres: "",
              direccion: "",
              telefonos: "",
              representante_nom: "",
              representante_ced: "",
              email: "",
              cupo: 0,
              estado: 0,
              relIdentificaTipo: null
            }
          }
        }
      }
      if (this.consulta.fecha != undefined) {
        try {
          const f = this.consulta.fecha.split();
          this.consulta.fecha = new moment(f[0], f[1], f[2]).toDate();
        } catch(e) {
          this.consulta.fecha = new moment.utc(this.consulta.fecha);
        }
      }

      if (this.$route.params.dato.relServicio != undefined) {
        this.servicioSeleccionado = this.consulta.relServicio.id;
      } else {
        this.consulta.relServicio = {
          id: 0,
          nombres: ""
        }
      }

      if (this.consulta.relServicio != undefined && this.consulta.relServicio.relEspecialidad != undefined) {
        this.especialidadSel = this.consulta.relServicio.relEspecialidad.id;
        this.cambiarEspecialidad();
      }  

      if (this.$route.params.dato.relMedico != undefined) {
        this.medicoSeleccionado = this.consulta.relMedico.id
      } else {
        this.consulta.relMedico = {
          id: 0,
          descripcion: ""
        };
      }
    } else {
      this.consulta.fecha = new Date();
    }
  }
}
</script>