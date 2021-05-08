<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('vista.clinica.medicos.editor-titulo')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.clinica.medicos.datos-personales') }}</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.codigo')">
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      <input type="checkbox" v-model="codigoGenerar"/>
                    </b-input-group-prepend>
                    <b-form-input type="text" v-model.trim="medico.codigo"/>
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                  <b-form-input type="text" v-model.trim="medico.identificacion" class="fondo-transparente-min"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.clinica.medicos.campos.titulo')">
                  <b-form-input type="text" v-model.trim="medico.titulo" class="fondo-transparente-min"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                  <b-form-input type="text" v-model="medico.nombres" :state="!$v.medico.nombres.$error"/>
                  <b-form-invalid-feedback>{{ $t('vista.clinica.medicos.validacion.nombres') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12">
                <b-form-group :label="$t('vista.ventas.clientes.campos.direccion')">
                  <b-form-input type="text" v-model.trim="medico.direccion"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.telefonos')">
                  <b-form-input type="text" v-model.trim="medico.telefonos"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.ventas.clientes.campos.correo')">
                  <b-form-input type="text" v-model.trim="medico.email"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.clinica.medicos.campos.registro')">
                  <b-form-input type="text" v-model.trim="medico.registro_profesional"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.clinica.medicos.campos.usuario')">
                  <b-form-select 
                    v-model="medico.usuario_id" 
                    :options="usuarios"
                    value-field="id"
                    text-field="codigo"
                    size="sm"
                  />
                  <b-form-invalid-feedback>{{ $t('vista.clinica.medicos.validacion.usuario') }}</b-form-invalid-feedback>
                </b-form-group>
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
                <b-button ref="btGuardar" :disabled="procesando" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
              </b-overlay>  
              <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
            </div>
          </b-form>
        </b-card>
      </b-colxx>
    </b-row>
  </div>  
</template>

<script>
import {es} from 'vuejs-datepicker/dist/locale';
const { required, minValue } = require("vuelidate/lib/validators");
const mayorQueCero = (value) => value > 0
export default {
  data() {
    return {
      es: es,
      medico: {
        id: 0,
        codigo: '',
        identificacion: '',
        titulo: '',
        nombres: '',
        registro_profesional: '',
        direccion: '',
        telefonos: '',
        email: '',
        empresa_id: 0,
        usuario_id: 0,
        estado: 0,
        relUsuario: {
          id: 0,
          nombre: ''
        }
      },
      usuarios: [],
      procesando: false,
      codigoGenerar: true
    }
  },
  validations: {
    medico: {
      nombres: {
        required
      },
    }
  },
  methods: {
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.mensaje("Revise los mensajes de validacion para poder continuar.", "No se puede guardar", "warning");
      } else {
        if (this.medico.usuario_id > 0) {
          console.log(this.medico.usuario_id);
          this.procesando = true;
          if (this.medico.id == 0) {
            // Validar medico existe
            this.$store
              .dispatch("clinica/medicoRegistrado", { 
                id: this.medico.id,
                cedula: this.medico.identificacion, 
                nombres: this.medico.nombres })
              .then(function(res) {
                if (res.status == 200) {
                  this.procesarGuardado();
                } else {
                  this.mensaje(res.data, "No se puede guardar", "warning");
                }
                this.procesando = false;
              }.bind(this))
              .catch(function(e) {
                let msg = "No se puede guardar por error relacionado al servidor";
                if (e.response.data != undefined)
                  msg = e.response.data;
                this.procesando = false;
                this.mensaje(msg, "Guardar Profesional", "danger");
              }.bind(this));
            this.procesando = false;
          } else {
            this.procesarGuardado();
            this.procesando = false;
          }
        } else {
          this.mensaje("Debe selecionar un usuario para poder continuar.", "No se puede guardar", "warning");
        }
      }
    },
    procesarGuardado() {
      this.$store
        .dispatch("clinica/medicoGuardar", this.medico)
        .then(function(res) {
          if (res.status <= 201) {
            this.mensaje(res.data.msj, "Guardando Profesional", "success");
            this.$router.back();
          } else {
            this.mensaje(res.data.msj, "Guardar Profesional", "warning");
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = "No se puede guardar por error relacionado al servidor";
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.mensaje(msj, "Guardar Profesional", "danger");
        }.bind(this)
      );
    },
    mensaje(contenido, titulo, variante) {
      this.$bvToast.toast(contenido, {
        title: titulo,
        variant: variante,
        toaster: 'b-toaster-bottom-right',
        solid: true,
        appendToast: false
      })
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      this.$router.back();
    },
  },
  computed: {
    tituloAccion: function() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.medico.id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    }
  },
  created() {
    this.$store
      .dispatch("seguridad/usuariosPorEstado", 0)
      .then(function(r) {
        if (r.data != undefined) {
          this.usuarios = r.data;
        }
      }.bind(this));
    if (this.$route.params.id > 0) {
      if (this.$route.params.dato.codigo.length > 0) {
        this.codigoGenerar = false;
      }
      this.medico = {
        id: this.$route.params.dato.id,
        codigo: this.$route.params.dato.codigo,
        identificacion: this.$route.params.dato.identificacion,
        titulo: this.$route.params.dato.titulo,
        nombres: this.$route.params.dato.nombres,
        registro_profesional: this.$route.params.dato.registro_profesional,
        direccion: this.$route.params.dato.direccion,
        telefonos: this.$route.params.dato.telefonos,
        email: this.$route.params.dato.email,
        empresa_id: this.$route.params.dato.empresa_id,
        usuario_id: this.$route.params.dato.usuario_id,
        estado: this.$route.params.dato.estado
      };
      if (this.$route.params.dato.relUsuario != null && this.$route.params.dato.relUsuario != undefined) {
        this.medico.relUsuario = this.$route.params.dato.relUsuario;
      }
    } 
  }
}
</script>

<style>

</style>