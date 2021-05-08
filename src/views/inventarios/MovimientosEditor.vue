<template>
  <div>
    <b-modal v-model="selProductoVer" title="Seleccionar producto" v-on:ok="productoSeleccionado();" v-on:hidden="pasarFoco();">
      <producto-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button variant="success" size="sm" @click="ok()" :disabled="productoNoSeleccionado">
          {{ $t('vista.comandos.aceptar') }}
        </b-button>
        <b-button size="sm" @click="cancel()">
          {{ $t('vista.comandos.cancelar') }}
        </b-button>
      </template>
    </b-modal>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="tipoDen"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" :title="tituloAccion" >
          <h6 class="mb-4">{{ $t('vista.transacciones.datos-generales') }}</h6>
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4" md="4">
                <b-form-group :label="$t('vista.transacciones.campos.numero')">
                  <b-form-input type="text" v-model="movimiento.numero" readonly/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="4">
                <b-form-group :label='$t("vista.transacciones.campos.fecha")'>
                  <datepicker
                    class="fecha-md"
                    :bootstrap-styling="true"
                    v-model="fechaProp"
                    :language="es"
                    :disabled="lectura"
                  ></datepicker>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="4">
                <b-form-group :label="$t('vista.inventarios.movimientos.campos.bodega')">
                  <b-form-select
                    v-model="movimiento.bodega_id"
                    :options="bodegas"
                    value-field="id"
                    text-field="nombre"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" md="12">
                <b-form-group :label="$t('vista.transacciones.campos.concepto')">
                  <b-form-input type="text" v-model.trim="movimiento.descripcion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
            </b-row>  
            <hr/>
            <div>
              <b-row>
                <b-colxx xxs="12" sm="8">
                  <b-input-group>
                    <b-form-input ref="txProducto" size="sm" v-model="productoSeleccion.nombre" placeholder="Buscar producto" @keyup.enter="buscarProducto()"/>
                    <b-input-group-append>
                      <b-button variant="primary" class="borde-recto" @click="buscarProducto()">
                        <i class="mdi mdi-magnify"/>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-colxx>
                <b-colxx xxs="12" sm="4">
                  <div class="d-flex">
                    <b-input-group class="w-100">
                      <b-form-input ref="txCantidad" size="sm" v-model="productoSeleccion.cantidad" placeholder="Cantidad"  @keyup.enter="agregarItem()"/>
                      <b-input-group-append>
                        <b-button variant="primary" class="borde-recto" @click="agregarItem()">
                          <i class="mdi mdi-plus"/>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <span
                      class="span-comando pt-1 flex-shrink-1 ml-2"
                      @click="vaciarItems()"
                      v-b-tooltip.hover
                      title="Eliminar todos los items"
                    >
                      <i class="mdi mdi-delete-sweep mdi-18px"/>
                    </span>
                  </div>  
                </b-colxx>
              </b-row>
            </div>
          </b-form>
          <b-table responsive :items="movimiento.relItems" :fields="itemCampos">
            <template #cell(acciones)="fila">
              <span
                class="span-comando pt-1"
                @click="eliminarItem(fila)"
                v-b-tooltip.hover
                title="Eliminar item"
              >
                <i class="mdi mdi-trash-can mdi-18px"/>
              </span>
            </template>
            <template #cell(cantidad)="fila">
              <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.cantidad"/>
            </template>
            <template #head(cantidad)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
          </b-table>
          <div class="mt-4">
            <b-overlay
              :show="procesando" 
              opacity=0.6
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
              @hidden="ocultaOverlay"
            >
              <b-button ref="btGuardar" :disabled="procesando || itemsVacio" @click="guardar()" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
            </b-overlay>  
            <b-button ref="btCancelar" :disabled="procesando" @click="cancelar()" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
          </div>
        </b-card>
      </b-colxx>
    </b-row>  
  </div>  
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import { mapGetters } from 'vuex'
export default {
  components: {
    Datepicker,
    'producto-seleccionar': ProductoSeleccionar
  },
  data: function () {
    return {
      es: es,
      movimiento: {
        id: 0,
        tipo: 0,
        fecha: null,
        bodega_id: 0,
        sucursal_id: 1,
        descripcion: "",
        numero: 0,
        referencia: 0,
        subtotal: 0, 
        subtotalex: 0, 
        descuento: 0, 
        impuestos: 0, 
        estado: 0,
        relItems: [],
        relBodega: null
      },
      bodegas: [],
      procesando: false,
      lectura: false,
      productoSeleccion: {
        id: 0,
        nombre: "",
        cantidad: 0,
        producto: null
      },
      selProductoVer: false,
      tipoDen: "Movimientos",
      itemCampos: [
        {
          label: this.$t("vista.comandos.acciones"), 
          key: "acciones", 
          sortable: false,
        },
        { 
          label: this.$t("vista.inventarios.productos.campos.codigo"), 
          key: "relProducto.codigo",
          sortable: true
        },
        { 
          label: this.$t("vista.inventarios.productos.campos.nombre"), 
          key: "relProducto.nombre",
          sortable: true
        },
        {
          label: this.$t("vista.inventarios.productos.campos.medida"), 
          key: "relProducto.medida", 
          sortable: true 
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.cantidad"),
          key: "cantidad",
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters("inventarios", [
      "selProducto"
    ]),
    productoNoSeleccionado() {
      return this.selProducto == null;
    },
    tituloAccion() {
      let res = this.$t('vista.comandos.nuevo');
      if (this.movimiento.id > 0) 
        res = this.$t('vista.comandos.modificar');
      return res;
    },
    fechaProp: {
      get: function() {
        if (this.movimiento.fecha != null)
          return this.$moment(this.movimiento.fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.movimiento.fecha = v;
      }
    },
    itemsVacio() {
      return this.movimiento.relItems == null || this.movimiento.relItems.length <= 0;
    },
  },
  methods: {
    productoSeleccionado() {
      this.productoSeleccion.id = this.selProducto.id;
      this.productoSeleccion.nombre = this.selProducto.nombre;
      this.productoSeleccion.producto = this.selProducto;
    },
    guardar() {
      if (this.movimiento.bodega_id == null || this.movimiento.bodega_id <= 0) {
        this.mensaje("Debe seleccionar la bodega", "Guardar", "danger");
        this.procesando = false;
      } else {
        this.procesarGuardado();
        this.procesando = false;
      }
    },
    pasarFoco() {
      if(this.selProducto != null) { 
        setTimeout(() => { this.enfocarCantidad(); }, 100);
      }
    },
    enfocarCantidad() {
      this.$refs.txCantidad.$el.focus();
      this.$refs.txCantidad.$el.select();
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
    procesarGuardado() {
      this.$store
        .dispatch("inventarios/movimientoGuardar", this.movimiento)
        .then(function(res) {
          if (res.status <= 201) {
            this.mensaje(res.data.msj, "Guardando registro", "success");
            this.$router.back();
          } else {
            this.mensaje(res.data.msj, "Guardar registro", "warning");
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = "No se puede guardar por error relacionado al servidor";
          console.log(e)
          if (e.response.data.msj != undefined);
            msj = e.response.data.msj;
          this.mensaje(msj, "Guardar", "danger");
        }.bind(this)
      );
    },
    agregarItem() {
      if (this.productoSeleccion != null && this.productoSeleccion.producto != null && this.productoSeleccion.cantidad > 0) {
        let item = {
          id: 0,
          movimiento_id: this.movimiento.id,
          producto_id: this.productoSeleccion.id,
          cantidad: this.productoSeleccion.cantidad,
          bodega_id: this.movimiento.bodega_id,
          indice: 0,
          lote_id: 0,
          presentacion_id: 0,
          costo: 0,
          adicional: 0,
          descuento: 0,
          relProducto: this.productoSeleccion.producto
        };
        this.movimiento.relItems.push(item);
        this.productoSeleccion = {
          cantidad: 0,
          nombre: "",
          indicaciones: "",
          productoid: 0,
          producto: null
        };
        this.$refs.txProducto.focus();
      }
    },
    eliminarItem(p) {
      if (this.movimiento.relItems.length == 1) {
        this.vaciarItems();
      } else {
        var ret = this.movimiento.relItems.filter(x => {
          return x.relProducto.id != p.item.relProducto.id;
        });
        this.movimiento.relItems = ret;  
      }
    },
    buscarProducto() {
      if (this.productoSeleccion.nombre.length > 0) {
        this.$store.commit('inventarios/setSelProductoTexto', this.productoSeleccion.nombre);
        this.selProductoVer = true;
      }
    },
    vaciarItems() {
      this.movimiento.relItems = [];
    }
  },
  created() {
    this.$store
      .dispatch("inventarios/bodegasPorEstado", 0)
      .then(function(r) {
        this.bodegas = r.data;
        if (this.bodegas.length > 0) {
          this.movimiento.bodega_id = this.bodegas[0].id;
        }
      }.bind(this));
  },
  mounted() {
    this.tipoDen = this.$route.params.tipo;
    this.tipoId = this.$route.params.tipoId;
    if (this.$route.params.id > 0) {
      this.movimiento = {
        id: this.$route.params.dato.id,
        tipo: this.$route.params.dato.tipo,
        numero: this.$route.params.dato.numero,
        bodega_id: this.$route.params.dato.bodega_id,
        descripcion: this.$route.params.dato.descripcion,
        sucursal_id: this.$route.params.dato.sucursal_id,
        referencia: this.$route.params.dato.referencia,
        subtotal: this.$route.params.dato.subtotal, 
        subtotalex: this.$route.params.dato.subtotalex, 
        descuento: this.$route.params.dato.descuento, 
        impuestos: this.$route.params.dato.impuestos,
        estado: this.$route.params.dato.estado,
        relItems: this.$route.params.dato.relItems,
        //relBodega: this.$route.params.dato.relBodega
      };
      if (this.$route.params.dato.fecha != undefined) {
        try {
          this.fechaProp = this.$moment(this.movimiento.fecha).toDate();
        } catch(e) {
          this.fechaProp = new moment.utc(this.movimiento.fecha).toDate();
        }
      } else {
        this.movimiento.fecha = null;
      }
    } else {
      this.movimiento.tipo = this.$route.params.tipoId;
      this.fechaProp = this.$moment.format('YYYY-MM-DD').toDate();
    }
  }
}
</script>
