<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('vista.inventarios.productos.editor-titulo')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.auto-codigo')">
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      <input type="checkbox" v-model="codigoGenerar"/>
                    </b-input-group-prepend>
                    <b-form-input type="text" v-model.trim="producto.codigo"/>
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.codigo-barras')">
                  <b-form-input type="text" v-model.trim="producto.barcode" class="fondo-transparente-min"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.nombre')">
                  <b-form-input type="text" v-model.trim="producto.nombre" class="fondo-transparente-min" :state="!$v.producto.nombre.$error"/>
                  <b-form-invalid-feedback>{{ $t('vista.inventarios.productos.validacion.nombres') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.medida')">
                  <b-form-input type="text" v-model="producto.medida"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12">
                <b-form-group :label="$t('vista.inventarios.productos.campos.descripcion')">
                  <b-form-input type="text" v-model.trim="producto.descripcion"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.costo')">
                  <b-form-input type="text" v-model.trim="producto.ultimo_costo"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.precio')">
                  <b-form-input type="text" v-model.trim="producto.precio"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.categoria')">
                  <b-form-select 
                    v-model="producto.grupo" 
                    :options="categorias"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.tipo')">
                  <b-form-select 
                    v-model="producto.tipo" 
                    :options="tiposProducto"
                    value-field="id"
                    text-field="denominacion"
                    size="sm"
                  />
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
const { required } = require("vuelidate/lib/validators");
//const mayorQueCero = (value) => value > 0
export default {
  data() {
    return {
      producto: {
        id: 0,
        codigo: '',
        barcode: '',
        nombre: '',
        grupo: 0,
        descripcion: '',
        medida: '',
        tipo: '',
        ultimo_costo: 0,
        precio: 0,
        adicional: 0,
        referencia: 0,
        marca: 0,
        modelo: 0,
        precio_origen: 0,
        empresa_id: 1,
        estado: 0
      },
      categorias: [],
      tiposProducto: [],
      procesando: false,
      codigoGenerar: true
    }
  },
  validations: {
    producto: {
      nombre: {
        required
      },
      tipo: {
        required
      },
    }
  },
  methods: {
    guardar() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$notify(
          "warning", 
          "No se puede guardar", 
          "Revise los mensajes de validacion para poder continuar.", 
          { duration: 3000, permanent: false }
        );
      } else {
        this.procesando = true;
        if (this.producto.id == 0) {
          // Validar producto existe
          this.$store
            .dispatch("inventarios/productoRegistrado", { 
              id: this.producto.id,
              codigo: this.producto.codigo, 
              nombre: this.producto.nombre })
            .then(function(res) {
              if (res.status == 200) {
                this.procesarGuardado();
              } else {
                this.$notify(
                  "warning", 
                  "No se puede guardar", 
                  res.data, 
                  { duration: 3000, permanent: false }
                );
              }
              this.procesando = false;
            }.bind(this))
            .catch(function(e) {
              console.log(e);
              let msg = "No se puede guardar por error relacionado al servidor";
              if (e.response != undefined)
                msg = e.response.data;
              this.procesando = false;
              this.$notify(
                "warning", 
                "No se puede guardar", 
                msg, 
                { duration: 3000, permanent: false }
              );
            }.bind(this));
          this.procesando = false;
        } else {
          this.procesarGuardado();
          this.procesando = false;
        }
      }
    },
    procesarGuardado() {
      this.$store
        .dispatch("inventarios/productoGuardar", this.producto)
        .then(function(res) {
          if (res.status <= 201) {
            this.$notify(
              "success", 
              "Guardar producto", 
              res.data.msj, 
              { duration: 3000, permanent: false }
            );
            this.$router.back();
          } else {
            this.$notify(
              "warning", 
              "Guardar producto", 
              res.data.msj, 
              { duration: 3000, permanent: false }
            );
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          console.log(e);
          this.procesando = false;
          let msj = "No se puede guardar por error relacionado al servidor";
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.$notify(
            "danger", 
            "Guardar producto", 
            res.data.msj, 
            { duration: 3000, permanent: false }
          );
        }.bind(this)
      );
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
      if (this.producto.id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    }
  },
  created() {
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 3 // Tipos de identificacion
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.tiposProducto = r.respuesta.data;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 4 // Tipos de identificacion
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.categorias = r.respuesta.data;
          }
        }
      }.bind(this));  
  },
  mounted() {
    if (this.$route.params.id > 0) {
      if (this.$route.params.dato.codigo.length > 0) {
        this.codigoGenerar = false;
      }
      this.producto = {
        id: this.$route.params.dato.id,
        codigo: this.$route.params.dato.codigo,
        nombre: this.$route.params.dato.nombre,
        barcode: this.$route.params.dato.barcode,
        grupo: this.$route.params.dato.grupo,
        descripcion: this.$route.params.dato.descripcion,
        medida: this.$route.params.dato.medida,
        tipo: this.$route.params.dato.tipo,
        ultimo_costo: this.$route.params.dato.ultimo_costo,
        precio: this.$route.params.dato.precio,
        adicional: this.$route.params.dato.adicional,
        referencia: this.$route.params.dato.referencia,
        marca: this.$route.params.dato.marca,
        modelo: this.$route.params.dato.modelo,
        precio_origen: this.$route.params.dato.precio_origen,
        empresa_id: this.$route.params.dato.empresa_id,
        estado: this.$route.params.dato.estado
      };
    }
  }
}
</script>
