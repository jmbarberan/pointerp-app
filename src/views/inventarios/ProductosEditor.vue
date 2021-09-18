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
                    <b-input-group-prepend is-text v-if="!lectura">
                      <input type="checkbox" v-model="codigoGenerar"/>
                    </b-input-group-prepend>
                    <b-form-input type="text" v-model.trim="producto.Codigo" :readonly="lectura"/>
                  </b-input-group>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.codigo-barras')">
                  <b-form-input type="text" v-model.trim="producto.Barcode" class="fondo-transparente-min" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.nombre')">
                  <b-form-input type="text" v-model.trim="producto.Nombre" class="fondo-transparente-min" :state="!$v.producto.Nombre.$error" :readonly="lectura"/>
                  <b-form-invalid-feedback>{{ $t('vista.inventarios.productos.validacion.nombre') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.medida')">
                  <b-form-input type="text" v-model="producto.Medida" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12">
                <b-form-group :label="$t('vista.inventarios.productos.campos.descripcion')">
                  <b-form-input type="text" v-model.trim="producto.Descripcion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.costo')">
                  <b-form-input type="text" v-model.trim="producto.UltimoCosto" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.grabado-iva')">
                  <b-checkbox class="mt-1" v-model="iva" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.categoria')">
                  <b-form-select 
                    v-model="producto.Grupo" 
                    :options="categorias"
                    value-field="Indice"
                    text-field="Denominacion"
                    size="sm"
                    :readonly="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group :label="$t('vista.inventarios.productos.campos.tipo')">
                  <b-form-select 
                    v-model="producto.Tipo" 
                    :options="tiposProducto"
                    value-field="Indice"
                    text-field="Denominacion"
                    size="sm"
                    :readonly="lectura"
                  />
                </b-form-group>
              </b-colxx>
            </b-row>
            <b-row class="mb-4">
              <b-colxx lg="12" md="12" sm="12">
                <b-card class="mb-4 mt-2">
                  <template v-if="!lectura" #header>
                    <h4 class="mt-4 ml-2">{{ $t('vista.inventarios.productos.campos.producto') }} - Agregar Precios</h4>
                    <b-row class="ml-1 mr-1">
                      <b-col sm="4" md="4" lg="4" class="espacio-corto mb-2">
                        <b-form-input ref="txPrecio" size="sm" v-model.number="precioSeleccion.Precio" placeholder="Precio" @keyup.enter="enfocarVolumen()"/>
                      </b-col>
                      <b-col sm="4" md="4" lg="4" class="espacio-corto mb-2">
                        <b-input-group>
                          <b-form-input ref="txVolumen" v-model.number="precioSeleccion.VolumenCondicion" placeholder="Volumen de venta" @keyup.enter="agregarPrecio()"/>
                          <b-input-group-append>
                            <b-button variant="primary" class="borde-recto" @click="agregarPrecio()" :disabled="lectura">
                              <i class="mdi mdi-plus"/>
                            </b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                      <b-col sm="4" md="4" lg="4" class="espacio-corto mb-2">
                        <b-input-group>
                          <b-form-input ref="txPorcentaje" size="sm" v-model.number="rentaPrecioSel" placeholder="Porcentaje rentabilidad" readonly/>
                          <b-input-group-append>
                            <b-button variant="primary" class="borde-recto" @click="eliminarPreciosTodos()" :disabled="lectura">
                              <i class="mdi mdi-delete-sweep"/>
                            </b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-col>
                    </b-row>
                  </template>
                  <b-table responsive :items="producto.relPrecios" :fields="preciosCampos" >
                    <template #cell(comandos)="fila">
                      <span v-if="!lectura"
                        class="span-comando pt-1"
                        @click="eliminarPrecio(fila)"
                        v-b-tooltip.hover
                        title="Eliminar fila"
                      >
                        <i class="mdi mdi-trash-can mdi-18px"/>
                      </span>
                      <span v-else class="span-comando pt-1">
                        <i class="mdi mdi-trash-can mdi-18px text-muted"/>
                      </span>
                    </template>
                    <template v-if="!lectura" #cell(Precio)="fila">
                      <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.Precio"/>
                    </template>
                    <template v-if="!lectura" #cell(VolumenCondicion)="fila">
                      <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.VolumenCondicion"/>
                    </template>
                    <template #cell(renta)="fila">
                      <div style="text-align: right;">
                        <span style="text-align: right;">{{ calcularRenta(fila) | dinero }}%</span>
                      </div>
                    </template>
                    <template #head(Precio)="data">
                      <div style="text-align: right;">
                        <span class="input-tabla-encabezado">{{ data.label }}</span>
                      </div>
                    </template>
                    <template #head(VolumenCondicion)="data">
                      <div style="text-align: right;">
                        <span class="input-tabla-encabezado">{{ data.label }}</span>
                      </div>
                    </template>
                    <template #head(renta)="data">
                      <div style="text-align: right;">
                        {{ data.label }}
                      </div>
                    </template>
                    <template #empty>
                      <h4>No hay precios registrados</h4>
                    </template>
                  </b-table>
                </b-card>
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
export default {
  data() {
    return {
      lectura: false,
      producto: {
        Id: 0,
        Codigo: '',
        Barcode: '',
        Nombre: '',
        Grupo: 0,
        Descripcion: '',
        Medida: '',
        Tipo: 0,
        UltimoCosto: 0,
        Precio: 0,
        Adicional: 0,
        Exitencia: 0,
        Referencia: 0,
        Marca: 0,
        Modelo: 0,
        PrecioOrigen: 0,
        EmpresaId: 1,
        EspecieId: 0,
        Estado: 0,
        EmbalajeTipo: 0,
        EmbalejeCantidad: 0,
        EmbalajeUnidad: 0,
        EmbalajeVolumen: "",
        relPrecios: [],
        relImposiciones: [],
        relPreciosEliminados: []
      },
      precioSeleccion: {
        Id: 0,
        ProductoId: 0,
        Precio: 0,
        VolumenCondicion: 0,
        MinimoCondicion: 0
      },
      categorias: [],
      tiposProducto: [],
      procesando: false,
      codigoGenerar: true,
      iva: false,
      preciosCampos: [
        { key: 'comandos', label: 'Acciones', sortable: false },
        { key: 'Precio', label: 'Precio', sortable: false },
        { key: 'VolumenCondicion', label: 'Volumen', sortable: false },
        { key: 'renta', label: 'Rentabilidad', sortable: false }
      ]
    }
  },
  validations: {
    producto: {
      Nombre: {
        required
      },
      Tipo: {
        required
      },
    }
  },
  methods: {
    calcularRenta(p){
      if (this.producto.UltimoCosto > 0 && p.item && p.item.Precio > 0)
        return ((p.item.Precio - this.producto.UltimoCosto) / this.producto.UltimoCosto) * 100;
    },
    enfocarVolumen(){
      this.$refs.txVolumen.$el.focus();
      this.$refs.txVolumen.$el.select();
    },
    enfocarPrecio() {
      this.$refs.txPrecio.$el.focus();
      this.$refs.txPrecio.$el.select();
    },
    agregarPrecio(){
      let item = {
        Id: 0,
        ProductoId: this.producto.Id,
        Precio: this.precioSeleccion.Precio,
        VolumenCondicion: this.precioSeleccion.VolumenCondicion,
        MinimoCondicion: 0,
      };
      this.producto.relPrecios.push(item);
      this.precioSeleccion = {
        Id: 0,
        ProductoId: 0,
        Precio: 0,
        VolumenCondicion: 0,
        MinimoCondicion: 0
      };
      this.enfocarPrecio();
    },
    eliminarPrecio(p) {
      if (p.item.Id > 0) {
        let item = {
          Id: p.item.Id,
          ProductoId: p.item.ProductoId,
          Precio: p.item.Precio,
          VolumenCondicion: p.item.VolumenCondicion,
          MinimoCondicion: p.item.MinimoCondicion,
        };
        this.producto.relPreciosEliminados.push(item);
      }
      if (this.producto.relPrecios.length == 1) {
        this.producto.relPrecios = [];
      } else {
        if (this.producto.Id > 0) {
          var ret = this.producto.relPrecios.filter(x => {
            return x.Id != p.item.Id;
          });
          this.producto.relPrecios = ret;  
        } else {
          var ret = this.producto.relPrecios.filter(x => {
            return x.Precio != p.item.Precio;
          });
          this.producto.relPrecios = ret;
        }
      }
    },
    eliminarPreciosTodos() {
      this.producto.relPreciosEliminados = this.producto.relPrecios.filter(pre => pre.Id > 0);
      this.producto.relPrecios = [];
    },
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
        if (this.producto.Id == 0) {
          // Validar producto existe
          this.$store
            .dispatch("inventarios/productoRegistrado", { 
              id: this.producto.Id,
              codigo: this.producto.Codigo, 
              nombre: this.producto.Nombre })
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
              let causa = "desconocido";
              if (e.message)
                causa = ": " + e.message;
              let msg = "No se puede guardar por error " + causa;
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
      // procesar iva
      if (this.iva) {
        if (this.producto.relImposiciones.length <= 0) {
          this.producto.relImposiciones.push({
            Id: 0,
            ImpuestoId: 1,
            ProductoId: this.producto.Id
          });
        }
      } else {
        this.producto.relImposiciones = [];
      }
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
          let causa = "desconocido";
          if (e.message)
            causa = ": " + e.message;
          this.procesando = false;
          let msj = "No se puede guardar por error " + causa;
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
      if (this.producto.Id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    rentaPrecioSel: {
      get: function() {
        if (this.producto.UltimoCosto > 0 && this.precioSeleccion != undefined && this.precioSeleccion.Precio > 0)
        return (((this.precioSeleccion.Precio - this.producto.UltimoCosto) / this.producto.UltimoCosto) * 100).toFixed(0) + "%";
      else
        return "-";
      }
    },
  },
  filters: {
    dinero(val) {
      return val.toFixed(2);
    }
  },
  created() {
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 3 // Tipos de producto
      }).then(function(r) {
        if (r.id == 1) {
          if (r.respuesta != null) {
            this.tiposProducto = r.respuesta.data;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/registrosPorTabla", {
        id: 4 // Categorias
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
      if (this.$route.params.dato.Codigo.length > 0) {
        this.codigoGenerar = false;
      }
      this.producto = {
        Id: this.$route.params.dato.Id,
        Codigo: this.$route.params.dato.Codigo,
        Nombre: this.$route.params.dato.Nombre,
        Barcode: this.$route.params.dato.Barcode,
        Grupo: this.$route.params.dato.Grupo,
        Descripcion: this.$route.params.dato.Descripcion,
        Medida: this.$route.params.dato.Medida,
        Tipo: this.$route.params.dato.Tipo,
        UltimoCosto: this.$route.params.dato.UltimoCosto,
        Precio: this.$route.params.dato.Precio,
        Adicional: this.$route.params.dato.Adicional,
        Referencia: this.$route.params.dato.Referencia,
        Exitencia: this.$route.params.dato.Exitencia,
        Marca: this.$route.params.dato.Marca,
        Modelo: this.$route.params.dato.Modelo,
        PrecioOrigen: this.$route.params.dato.PrecioOrigen,
        EmpresaId: this.$route.params.dato.EmpresaId,
        EspecieId: this.$route.params.dato.EspecieId,
        EmbalajeTipo: this.$route.params.dato.EmbalajeTipo,
        EmbalejeCantidad: this.$route.params.dato.EmbalejeCantidad,
        EmbalajeUnidad: this.$route.params.dato.EmbalajeUnidad,
        EmbalajeVolumen: this.$route.params.dato.EmbalajeVolumen,
        Estado: this.$route.params.dato.Estado,
        relPrecios: this.$route.params.dato.relPrecios,
        relImposiciones: this.$route.params.dato.relImposiciones,
        relPreciosEliminados: []
      };
      if (this.producto.relImposiciones.length > 0) {
        this.iva = true;
      }
    }
    if (this.$route.params.lectura) {
      this.lectura = this.$route.params.lectura;
    }
  }
}
</script>
