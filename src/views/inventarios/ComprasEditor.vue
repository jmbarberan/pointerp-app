<template>
  <div>
    <b-modal v-model="selProductoVer" title="Seleccionar producto" v-on:ok="productoSeleccionado();" v-on:hidden="pasarFoco();">
      <producto-seleccionar v-on:buscadorProd-seleccionado="productoSeleccionado()"/>
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
          <b-form class="av-tooltip mb-5 tooltip-label-right">
            <b-row>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.transacciones.campos.numero')">
                  <b-form-input type="text" v-model="compra.numero" readonly/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="3">
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
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.inventarios.movimientos.campos.bodega')">
                  <b-form-select
                    v-model="compra.bodega_id"
                    :options="bodegas"
                    value-field="id"
                    text-field="nombre"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="4" md="3">
                <b-form-group :label="$t('vista.ventas.facturas.campos.sucursal')">
                  <b-form-select
                    v-model="compra.sucursal_id"
                    :options="sucursales"
                    value-field="id"
                    text-field="nombre"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" md="12">
                <b-form-group :label="$t('vista.transacciones.campos.concepto')">
                  <b-form-input type="text" v-model.trim="compra.descripcion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
            </b-row>  
            <hr v-if="!lectura"/>
            <div v-if="!lectura">
              <b-row>
                <b-colxx xxs="12" sm="5">
                  <b-form-group label="Buscar producto" class="has-float-label mb-4">
                    <b-input-group>
                      <b-form-input ref="txProducto" size="sm" v-model="productoSeleccion.nombre" placeholder="digite el nombre y pulse enter" @keyup.enter="buscarProducto()"/>
                      <b-input-group-append is-text v-if="productoSeleccion.producto">
                        {{ productoSeleccion.producto.medida }}
                      </b-input-group-append>
                      <b-input-group-append>
                        <b-button variant="primary" class="borde-recto" @click="buscarProducto()">
                          <i class="mdi mdi-magnify"/>
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>  
                </b-colxx>
                <b-colxx xxs="12" sm="2">
                  <b-form-group label="Cantidad" class="has-float-label mb-4">
                    <b-form-input ref="txCantidad" size="sm" v-model.number="productoSeleccion.cantidad" @keyup.enter="pasarFocoDescuento()"/>
                  </b-form-group>  
                </b-colxx>
                <b-colxx xxs="12" sm="2">
                  <b-form-group label="% Descuento" class="has-float-label mb-4">
                    <b-input-group class="w-100">
                      <b-form-input ref="txDescuento" size="sm" v-model.number="productoSeleccion.descuento" @keyup.enter="pasarFocoPrecio()"/>
                      <b-input-group-append is-text>%</b-input-group-append>
                    </b-input-group>
                  </b-form-group>  
                </b-colxx>
                <b-colxx xxs="12" sm="3">
                  <div class="d-flex">
                    <b-form-group label="Costo" class="has-float-label mb-4">
                      <b-input-group class="w-100">
                        <b-form-input ref="txCosto" size="sm" v-model.number="productoSeleccion.costo" @keyup.enter="agregarItem()"/>
                        <b-input-group-append>
                          <b-button variant="primary" class="borde-recto" @click="agregarItem()">
                            <i class="mdi mdi-plus"/>
                          </b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>  
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
          <b-table responsive :items="compra.relItems" :fields="itemCampos">
            <template #cell(acciones)="fila">
              <span v-if="!lectura"
                class="span-comando pt-1"
                @click="eliminarItem(fila)"
                v-b-tooltip.hover
                title="Eliminar item"
              >
                <i class="mdi mdi-trash-can mdi-18px"/>
              </span>
              <span v-else class="span-comando pt-1">
                <i class="mdi mdi-trash-can mdi-18px text-muted"/>
              </span>
            </template>
            <template #cell(cantidad)="fila">
              <b-form-input v-if="!lectura" class="input-tabla-celda text-right" size="sm" v-model="fila.item.cantidad"/>
              <div v-else style="text-align: right;">
                <span>
                  {{ fila.item.cantidad }}
                </span>
              </div>
            </template>
            <template #cell(descuento)="fila">
              <b-form-input v-if="!lectura" class="input-tabla-celda text-right" size="sm" v-model="fila.item.descuento"/>
              <div v-else style="text-align: right;">
                <span>
                  % {{ fila.item.descuento }}
                </span>
              </div>
            </template>
            <template #cell(costo)="fila">
              <b-form-input v-if="!lectura" class="input-tabla-celda text-right" size="sm" v-model="fila.item.costo"/>
              <div v-else style="text-align: right;">
                <span>
                  $ {{ parseFloat(fila.item.costo) | dinero }}
                </span>
              </div>
            </template>

            <template #cell(subtotal)="fila">
              <div style="text-align: right;">
                <span style="color: red; padding-rigth: 10px" v-if="fila.item.descuento != undefined && parseFloat(fila.item.descuento) > 0">
                  -({{ (parseFloat(fila.item.cantidad) * parseFloat(fila.item.costo)) * (parseFloat(fila.item.descuento) / 100) | dinero }})
                </span>
                <span v-if="fila.item.descuento != undefined && parseFloat(fila.item.descuento) > 0">
                  $ {{ (parseFloat(fila.item.cantidad) * parseFloat(fila.item.costo)) * ((100 - parseFloat(fila.item.descuento)) / 100) | dinero }}
                </span>
                <span v-else>
                  $ {{ parseFloat(fila.item.cantidad) * parseFloat(fila.item.costo) | dinero }}
                </span>
              </div>
            </template>
            <template #head(cantidad)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(costo)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(descuento)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(subtotal)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #empty>
              <h4>No hay items registrados</h4>
            </template>
          </b-table>
          <hr/>
          <div style="text-align: right;">
            <span class="font-weight-semibold mr-4">TOTAL</span>
            <span class="font-weight-semibold mr-2">$ {{ total | dinero }}</span>
          </div>  
          <div class="mt-4">
            <b-overlay
              :show="procesando" 
              opacity=0.6
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
              @hidden="ocultaOverlay"
            >
              <b-button v-if="!lectura" ref="btGuardar" :disabled="guardarDesactivado" @click="guardar();" variant="success">{{ $t('vista.comandos.guardar') }}</b-button>
              <b-button v-else ref="btModificar" @click="modificar();" variant="success" class="ml-4">{{ $t('vista.comandos.modificar') }}</b-button>
            </b-overlay>
            <b-button ref="btCancelar" :disabled="procesando" @click="cancelar();" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import { tipoCompra, tipoDenominacion } from "@/constants/tipos";
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import { mapGetters } from 'vuex';
import moment from 'moment'

export default {
  components: {
    Datepicker,
    'producto-seleccionar': ProductoSeleccionar,
  },
  data: function () {
    return {
      es: es,
      compra: {
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
        relBodega: null,
        relSucursal: null
      },
      original: null,
      sucursales: [],
      bodegas: [],
      procesando: false,
      lectura: false,
      productoSeleccion: {
        id: 0,
        nombre: "",
        cantidad: 0,
        costo: 0,
        descuento: 0,
        producto: {
          id: 0,
          nombre: '',
          medida: ''
        }
      },
      clienteSeleccion: {
        id: 0,
        nombre: "",
      },
      selProductoVer: false,
      tipoId: tipoCompra,
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
          label: this.$t("vista.ventas.facturas.campos.producto"), 
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
        },
        {
          label: this.$t("vista.ventas.facturas.campos.descuento_porcentaje"),
          key: "descuento",
          sortable: true
        },
        {
          label: this.$t("vista.inventarios.movimientos.campos.costo"),
          key: "costo",
          sortable: true
        },
        {
          label: this.$t("vista.ventas.facturas.campos.subtotal"),
          key: "subtotal",
          sortable: true
        }
      ],
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
      let res = "Solo lectura"
      if (!this.lectura) {
        res = this.$t('vista.comandos.nuevo');
          if (this.compra.id > 0) 
            res = this.$t('vista.comandos.modificar');
      }
      return res;
    },
    fechaProp: {
      get: function() {
        if (this.compra.fecha != null)
          return this.$moment(this.compra.fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.compra.fecha = v;
      }
    },
    total() {
      return this.compra.relItems.reduce(
        (acc, item) => acc + 
          (
            item.descuento != undefined && parseFloat(item.descuento) > 0 ? 
            (item.cantidad * item.costo) * ((100 - item.descuento) / 100) :
            (item.cantidad * item.costo)
          )  
        , 0
      );
    },
    guardarDesactivado() {
      return this.procesando ||
        this.compra.relItems.length <= 0 ||
        this.compra.bodega_id <= 0 ||
        this.compra.sucursal_id <= 0;
    },
    tipoDen() {
      return tipoDenominacion(tipoCompra);
    }
  },
  methods: {
    productoSeleccionado() {
      if (this.selProductoVer) {
        this.selProductoVer = false;
      }
      this.productoSeleccion.id = this.selProducto.id;
      this.productoSeleccion.nombre = this.selProducto.nombre;
      this.productoSeleccion.producto = this.selProducto;
      this.productoSeleccion.costo = this.selProducto.costo;
      this.pasarFoco();
    },
    guardar() {
      this.procesarGuardado(false);
    },
    procesarGuardado(imp) {
      if (this.compra.tipo >= 0 || this.compra.tipo == undefined)
        this.compra.tipo = this.tipoId;
      this.compra.subtotalex = this.total;
      this.procesando = true;
      this.$store
        .dispatch("inventarios/movimientoGuardar", this.compra)
        .then(function(res) {
          if (res.data.cid > 0)
            this.compra.id = res.data.cid;
            if (this.compra.numero <= 0)
              this.compra.numero = res.data.num;
          if (res.status <= 201) {
            this.$notify(
              "success",
              "Guadando compra",
              res.data.msj,
              { duration: 3000, permanent: false }
            );
          } else {
            this.$notify(
              "warning",
              "Guardando compra",
              res.data.msj,
              { duration: 3000, permanent: false }
            );
          }
          this.procesando = false;
        }.bind(this))
        .catch(function(e) {
          this.procesando = false;
          let msj = "No se puede guardar por error relacionado al servidor";
          this.$notify(
            "danger",
            "Guardando registro",
            msj,
            { duration: 3000, permanent: false }
          );
        }.bind(this)
      );
      this.procesando = false;
    },
    pasarFoco() {
      if(this.selProducto != null) { 
        setTimeout(() => {
          this.enfocarCantidad();
        }, 100);
      }
    },
    enfocarCantidad() {
      this.$refs.txCantidad.$el.focus();
      this.$refs.txCantidad.$el.select();
    },
    pasarFocoDescuento() {
      this.$refs.txDescuento.$el.focus();
      this.$refs.txDescuento.$el.select();
    },
    pasarFocoPrecio() {
      this.$refs.txPrecio.$el.focus();
      this.$refs.txPrecio.$el.select();
    },
    ocultaOverlay() {
      this.$refs.btGuardar.focus();
    },
    cancelar() {
      if (this.original != null) {
        this.compra = this.original;
        this.original = null;
        this.lectura = true;
      } else {
        this.$router.back();
      }
    },
    agregarItem() {
      if (this.productoSeleccion != null && 
        this.productoSeleccion.producto != null && 
        this.productoSeleccion.cantidad > 0 && 
        this.productoSeleccion.costo > 0) {
        let item = {
          id: 0,
          movimiento_id: this.compra.id,
          producto_id: this.productoSeleccion.id,
          cantidad: this.productoSeleccion.cantidad,
          bodega_id: this.compra.bodega_id,
          indice: 0,
          lote_id: 0,
          presentacion_id: 0,
          costo: this.productoSeleccion.costo,
          adicional: 0,
          descuento: this.productoSeleccion.descuento,
          relProducto: this.productoSeleccion.producto
        };
        this.compra.relItems.push(item);
        this.productoSeleccion = {
          cantidad: 0,
          nombre: "",
          indicaciones: "",
          productoid: 0,
          costo: 0,
          descuento: 0,
          producto: null,
          existencia: '0'
        };
        this.$refs.txProducto.focus();
      }
    },
    eliminarItem(p) {
      if (this.compra.relItems.length == 1) {
        this.vaciarItems();
      } else {
        var ret = this.compra.relItems.filter(x => {
          return x.relProducto.id != p.item.relProducto.id;
        });
        this.compra.relItems = ret;  
      }
    },
    buscarProducto() {
      if (!this.lectura && this.productoSeleccion.nombre.length > 0) {
        this.$store.commit('inventarios/setSelProductoTexto', this.productoSeleccion.nombre);
        this.selProductoVer = true;
      }
    },
    vaciarItems() {
      this.compra.relItems = [];
    },
    modificar() {
      this.original = this.compra;
      this.lectura = false;
    }
  },
  filters: {
    dinero(val) {
      if (!val) {
        return '';
      }

      try {
        return val.toFixed(2);
      } catch {
        return val;
      }
    }
  },
  created() {
    this.$store
      .dispatch("inventarios/bodegasPorEstado", 0)
      .then(function(r) {
        this.bodegas = r.data;
        if (this.bodegas.length > 0) {
          this.compra.bodega_id = this.bodegas[0].id;
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", 1)
      .then(function(r) {
        if (r) {
          this.sucursales = r.data;
          if (this.sucursales.length > 0) {
            this.compra.sucursal_id = this.sucursales[0].id;
          }
        }
      }.bind(this));
  },
  mounted() {
    if (this.$route.params.dato != null) {
      this.compra = {
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
        relItems: this.$route.params.dato.relItems
      };
      if (this.$route.params.dato.fecha != undefined) {
        try {
          this.fechaProp = this.$moment(this.$route.params.dato.fecha).toDate();
        } catch(e) {
          this.fechaProp = new moment.utc(this.$route.params.dato.fecha).toDate();
        }
      } else {
        this.compra.fecha = null;
      }
    } else {
      this.compra.tipo = this.$route.params.tipoId;
      this.fechaProp = this.$moment().format('YYYY-MM-DD');
    } 
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }
  }
}
</script>
