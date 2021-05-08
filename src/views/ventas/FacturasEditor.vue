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
    <b-modal v-model="selClienteVer" title="Seleccionar cliente" v-on:ok="seleccionadoCliente()">
      <cliente-seleccionar/>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" @click="ok()" :disabled="clienteNoSeleccionado">
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
                  <b-form-input type="text" v-model="venta.numero" readonly/>
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
                    v-model="venta.movimiento_id"
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
                    v-model="venta.sucursal_id"
                    :options="sucursales"
                    value-field="id"
                    text-field="nombre"
                    size="sm"
                    :disabled="lectura"
                  />
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" md="12">
                <h6 v-if="verDatosCliente" class="mb-4">{{ $t('vista.ventas.facturas.datos-cliente') }}</h6>
              </b-colxx>
              <b-colxx xxs="12" sm="4">
                <b-form-group :label="$t('vista.ventas.clientes.campos.cedula')">
                  <div>
                    <b-overlay :show="ocupadoCedula" rounded="lg" opacity="0.6">
                      <template #overlay>
                        <div class="d-flex align-items-center">
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <b-spinner type="grow" variant="dark"></b-spinner>
                          <b-spinner small type="grow" variant="secondary"></b-spinner>
                          <!-- SR para lectores de pantallas -->
                          <span class="sr-only">Espere por favor...</span>
                        </div>
                      </template>
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="venta.relCliente.identificacion" @keyup.enter="validarCedula()" :readonly="lectura"/>
                        <b-input-group-append is-text>
                          <i class="mdi mdi-magnify"/>
                        </b-input-group-append>  
                      </b-input-group>  
                    </b-overlay>
                  </div>  
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="8">
                <b-form-group :label="$t('vista.ventas.clientes.campos.nombres')">
                  <b-input-group>
                    <b-form-input type="text" v-model="venta.relCliente.nombres" :state="!$v.venta.relCliente.nombres.$error" :readonly="lectura" @keyup.enter="buscarCliente()" />
                    <b-input-group-append>
                      <b-button variant="primary" class="borde-recto" @click="buscarCliente()">
                        <i class="mdi mdi-magnify"/>
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                  <b-form-invalid-feedback>{{ $t('vista.ventas.facturas.validacion.cliente') }}</b-form-invalid-feedback>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group v-if="verDatosCliente" :label="$t('vista.ventas.clientes.campos.direccion')">
                  <b-form-input type="text" v-model="venta.relCliente.direccion" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="6">
                <b-form-group v-if="verDatosCliente" :label="$t('vista.ventas.clientes.campos.telefonos')">
                  <b-form-input type="text" v-model="venta.relCliente.telefonos" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
              <b-colxx xxs="12" sm="12" md="12">
                <b-form-group :label="$t('vista.transacciones.campos.concepto')">
                  <b-form-input type="text" v-model.trim="venta.observaciones" :readonly="lectura"/>
                </b-form-group>
              </b-colxx>
            </b-row>  
            <hr v-if="!lectura"/>
            <div v-if="!lectura">
              <b-row>
                <b-colxx xxs="12" sm="5">
                  <b-form-group label="Buscar producto" class="has-float-label mb-4">
                    <b-input-group>
                      <b-form-input ref="txProducto" size="sm" v-model="productoSeleccion.nombre" placeholder="Digite el nombre pulse enter" @keyup.enter="buscarProducto()"/>
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
                    <b-input-group class="w-100">
                      <b-form-input ref="txCantidad" size="sm" v-model.number="productoSeleccion.cantidad" @keyup.enter="pasarFocoDescuento()"/>
                      <b-input-group-append is-text>
                        {{ productoSeleccion.existencia }}
                      </b-input-group-append>
                    </b-input-group>
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
                    <b-form-group label="Precio de venta" class="has-float-label mb-4">
                      <b-input-group class="w-100">
                        <b-form-input ref="txPrecio" size="sm" v-model.number="productoSeleccion.precio" @keyup.enter="agregarItem()"/>
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
          <b-table responsive :items="venta.relItems" :fields="itemCampos">
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
            <template v-if="!lectura" #cell(cantidad)="fila">
              <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.cantidad"/>
            </template>
            <template v-if="!lectura" #cell(descuento)="fila">
              <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.descuento"/>
            </template>
            <template v-if="!lectura" #cell(precio)="fila">
              <b-form-input class="input-tabla-celda text-right" size="sm" v-model="fila.item.precio"/>
            </template>
            <template #cell(subtotal)="fila">
              <div style="text-align: right;">
                <span v-if="fila.item.descuento != undefined && parseFloat(fila.item.descuento) > 0">
                  $ {{ (parseFloat(fila.item.cantidad) * parseFloat(fila.item.precio)) * ((100 - parseFloat(fila.item.descuento)) / 100) | dinero }}
                </span>
                <span v-else>
                  $ {{ parseFloat(fila.item.cantidad) * parseFloat(fila.item.precio) | dinero }}
                </span>
              </div>
            </template>
            <template #head(cantidad)="data">
              <div style="text-align: right;">
                <span class="input-tabla-encabezado">{{ data.label }}</span>
              </div>
            </template>
            <template #head(precio)="data">
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
            <b-button ref="btImprimir" :disabled="procesando" @click="guardarImprimir();" variant="primary" class="ml-4">{{ $t('vista.comandos.imprimir') }}</b-button>
            <b-button ref="btCancelar" :disabled="procesando" @click="cancelar();" variant="primary" class="ml-4">{{ $t('vista.comandos.cancelar') }}</b-button>
          </div>
        </b-card>
      </b-colxx>
    </b-row>
    <div id="prnFactura">
      <!--v-runtime-template :template="plantilla"></v-runtime-template-->
      <b-row class="invisible">
        <table style="margin-top: 2.9cm; widt: 100%">
          <td style="max-width: 11cm;">
            <div style="margin-left: 9mm">
              <span style="font-size: 8pt">{{ this.venta.relCliente.nombres }}</span>
            </div>
            <div style="margin-left: 9mm">
              <span style="font-size: 8pt">{{ this.venta.relCliente.direccion }}.</span>
            </div>
            <table style="width: 9.7cm; margin-left: 11mm">
              <td class="col" style="width: 1.8cm;">
                <span style="font-size: 8pt">{{ this.venta.relCliente.telefonos }}.</span>
              </td>
              <td class="col" style="width: 2cm">
                <span style="font-size: 8pt">{{ this.venta.relCliente.identificacion }}</span>
              </td>
              <td class="col" style="width: 2cm">
                <span style="font-size: 8pt">{{ $moment(venta.fecha).format("YYYY-MM-DD") }}</span>
              </td>
            </table>
            <table style="width:85%; margin-top:10px; padding-top: 10px;">
              <tbody>
                <tr v-for="item in venta.relItems" :key="item.relProducto.id">
                  <td style="padding-top:10px; padding-bottom:10px; width: 1cm;">
                    <div href="#" style="font-size: 7pt; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                      {{ item.cantidad }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; width: 1cm;">
                    <div style="font-size: 7pt; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px; min-width: 2cm;">
                      {{ item.relProducto.medida }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; width: 5cm;">
                    <div style="font-size: 7pt; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                      {{ item.relProducto.nombre }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; text-align: right; width: 1.5cm">
                    <div href="#" style="font-size: 7pt; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                      {{ item.precio | dinero }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; text-align: right; width: 1.5cm">
                    <div href="#" style="font-size: 7pt; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                      <span v-if="item.descuento != undefined && parseFloat(item.descuento) > 0">
                        $ {{ (parseFloat(item.cantidad) * parseFloat(item.precio)) * ((100 - parseFloat(item.descuento)) / 100) | dinero }}
                      </span>
                      <span v-else>
                        $ {{ parseFloat(item.cantidad) * parseFloat(item.precio) | dinero }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="float: left; font-size: 8pt">
              # {{ venta.numero }}
            </div>
            <div style="float: right;padding-right: 1.3cm; margin-top: 10px">
              <div style="float: rigth; font-size: 8pt;">
                <span>Subtotal  </span> <span>{{ total | dinero }}</span>
              </div>
              <div style="float: rigth; font-size: 8pt;">
                <span>IVA  </span> <span>{{ 0.00 }}</span>
              </div>
              <div style="float: rigth; font-size: 8pt;">
                <span>Subtotal  </span> <span>{{ total | dinero }}</span>
              </div>
            </div>  
          </td>
          <td style="width: 11cm;">
            <div style="margin-left: 9mm;">
              <span style="font-size: 8pt">{{ this.venta.relCliente.nombres }}</span>
            </div>
            <div style="margin-left: 9mm;">
              <span style="font-size: 8pt">{{ this.venta.relCliente.direccion }}.</span>
            </div>
            <table style="width: 100%; margin-left: 9mm;">
              <td class="col" style="width: 1.8cm;">
                <span style="font-size: 8pt">{{ this.venta.relCliente.telefonos }}.</span>
              </td>
              <td class="col" style="width: 2cm">
                <span style="font-size: 8pt">{{ this.venta.relCliente.identificacion }}</span>
              </td>
              <td class="col" style="width: 2cm">
                <span style="font-size: 8pt">{{ $moment(venta.fecha).format("YYYY-MM-DD") }}</span>
              </td>
            </table>
            <table style="width: 96%; margin-top:10px; margin-left: 0mm; padding-top: 10px;">
              <tbody>
                <tr v-for="item in venta.relItems" :key="item.relProducto.id">
                  <td style="padding-top:10px; padding-bottom:10px; width: 1cm;">
                    <div href="#" style="font-size: 7pt; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                      {{ item.cantidad }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; width: 1cm;">
                    <div style="font-size: 7pt; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px; min-width: 2cm;">
                      {{ item.relProducto.medida }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; width: 5cm;">
                    <div style="font-size: 7pt; line-height: 1; margin-bottom:0; color:#303030; font-weight:500; margin-top: 0px;">
                      {{ item.relProducto.nombre }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; text-align: right; width: 1.5cm">
                    <div href="#" style="font-size: 7pt; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                      {{ item.precio | dinero }}
                    </div>
                  </td>
                  <td style="padding-top:10px; padding-bottom:10px; text-align: right; width: 1.5cm">
                    <div href="#" style="font-size: 7pt; text-decoration: none; line-height: 1; color:#909090; margin-top: 0px; margin-bottom:0;">
                      <span v-if="item.descuento != undefined && parseFloat(item.descuento) > 0">
                        $ {{ (parseFloat(item.cantidad) * parseFloat(item.precio)) * ((100 - parseFloat(item.descuento)) / 100) | dinero }}
                      </span>
                      <span v-else>
                        $ {{ parseFloat(item.cantidad) * parseFloat(item.precio) | dinero }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="float: left; font-size: 8pt">
              # {{ venta.numero }}
            </div>
            <div style="float: right; padding-right: 6mm; margin-top: 10px">
              <div style="float: rigth; font-size: 8pt;">
                <span>Subtotal  </span> <span>{{ total | dinero }}</span>
              </div>
              <div style="float: rigth; font-size: 8pt;">
                <span>IVA  </span> <span>{{ 0.00 }}</span>
              </div>
              <div style="float: rigth; font-size: 8pt;">
                <span>Subtotal  </span> <span>{{ total | dinero }}</span>
              </div>
            </div> 
          </td>
        </table>  
      </b-row>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { es } from 'vuejs-datepicker/dist/locale';
import ProductoSeleccionar from "@/components/Inventarios/ProductoSeleccionar";
import ClienteSeleccionar from "@/components/Maestros/ClienteSeleccionar";
const { required } = require("vuelidate/lib/validators");
import { mapGetters } from 'vuex';
import { slogan } from "@/constants/config";
import moment from 'moment'
import VRuntimeTemplate from "v-runtime-template";

export default {
  components: {
    Datepicker,
    'producto-seleccionar': ProductoSeleccionar,
    'cliente-seleccionar': ClienteSeleccionar,
    VRuntimeTemplate
  },
  data: function () {
    return {
      es: es,
      venta: {
        id: 0,
        tipo: 11,
        numero: 0,
        fecha: null,
        sucursal_id: 1,
        plazo: 0,
        cliente_id: 0,
        vendedor_id: 1,
        observaciones: "",
        descuento_porcentaje: 0,
        porcentaje_venta: 0,
        subtotal: 0, 
        subtotalex: 0, 
        descuento: 0, 
        recargo: 0, 
        flete: 0, 
        impuestos: 0, 
        abonos: 0, 
        estado: 0,
        especie: 0, 
        movimiento_id: 0, 
        ecomprobante_id: 0, 
        operador: '',
        relCliente: {
          id: 0,
          nombres: '',
          identificacion: ''
        },
        relItems: [],
        relSucursal: null
      },
      original: null,
      sucursales: [],
      bodegas: [],
      operadores: [],
      procesando: false,
      lectura: false,
      productoSeleccion: {
        id: 0,
        nombre: "",
        cantidad: 0,
        precio: 0,
        descuento: 0,
        producto: {
          id: 0,
          nombre: '',
          medida: ''
        },
        existencia: '0'
      },
      clienteSeleccion: {
        id: 0,
        nombre: "",
      },
      plantilla: "",
      plantillaCompilada: "",
      selProductoVer: false,
      selClienteVer: false,
      tipoDen: "Facturas",
      tipoId: 11,
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
          label: this.$t("vista.ventas.facturas.campos.precio"),
          key: "precio",
          sortable: true
        },
        {
          label: this.$t("vista.ventas.facturas.campos.subtotal"),
          key: "subtotal",
          sortable: true
        }
      ],
      ocupadoCedula: false,
      verDatosCliente: false,
    }
  },
  validations: {
    venta: {
      relCliente: {
        nombres: {
          required
        }
      }
    }
  },
  computed: {
    ...mapGetters("inventarios", [
      "selProducto"
    ]),
    ...mapGetters("maestros", [
      "selCliente"
    ]),
    empresa() {
      return {
        direccion: this.$store.state.empresaAccedida.direccion,
        telefonos: this.$store.state.empresaAccedida.telefonos,
        lema: slogan
      };
    },
    productoNoSeleccionado() {
      return this.selProducto == null;
    },
    clienteNoSeleccionado() {
      return this.selCliente == null;
    },
    tituloAccion() {
      let res = "Solo lectura"
      if (!this.lectura) {
        res = this.$t('vista.comandos.nuevo');
          if (this.venta.id > 0) 
            res = this.$t('vista.comandos.modificar');
      }
      return res;
    },
    fechaProp: {
      get: function() {
        if (this.venta.fecha != null)
          return this.$moment(this.venta.fecha).toDate();
        else
          return null;
      },
      set: function(v) {
        this.venta.fecha = v;
      }
    },
    total() {
      return this.venta.relItems.reduce(
        (acc, item) => acc + 
          (
            item.descuento != undefined && parseFloat(item.descuento) > 0 ? 
            (item.cantidad * item.precio) * ((100 - item.descuento) / 100) :
            (item.cantidad * item.precio)
          )  
        , 0
      );
    },
    guardarDesactivado() {
      return this.procesando || 
        this.venta.relItems.length <= 0 || 
        this.venta.movimiento_id <= 0 || 
        this.venta.cliente_id <= 0 || 
        this.venta.sucursal_id <= 0;
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
      this.productoSeleccion.precio = this.selProducto.precio;
      this.productoSeleccion.existencia = 0;
      this.$store
        .dispatch("inventarios/productoExistencias", {
          id: this.selProducto.id,
          bodega: this.venta.movimiento_id
        })
        .then(function(r) {
          if (r.id == 1) {
            let s = "";
            if (r.respuesta.data != undefined) {
              r.respuesta.data.forEach(e => {
                if (s.length > 0) {
                  s = s + "; " + (parseFloat(e.ingresos) - parseFloat(e.egresos));
                } else {
                  s = (parseFloat(e.ingresos) - parseFloat(e.egresos));
                }
              });
              if (s.length <= 0) {
                s = '0';
              }
              this.productoSeleccion.existencia = s;
            }
          }
        }.bind(this));
      this.pasarFoco();
    },
    seleccionadoCliente() {
      this.clienteSeleccion.id = this.selCliente.id;
      this.clienteSeleccion.nombre = this.selCliente.nombre;
      this.venta.cliente_id = this.selCliente.id;
      this.venta.relCliente = this.selCliente;
      // Validar cupo de credito
    },
    guardar() {
      this.procesarGuardado(false);
    },
    guardarImprimir() {
      //this.procesarGuardado(true);
      this.imprimir();
    },
    procesarGuardado(imp) {
      if (this.venta.tipo >= 0 || this.venta.tipo == undefined)
        this.venta.tipo = this.tipoId;
      this.venta.subtotalex = this.total;
      this.procesando = true;
      this.$store
        .dispatch("ventas/ventaGuardar", this.venta)
        .then(function(res) {
          if (res.data.cid > 0)
            this.venta.id = res.data.cid;
            if (this.venta.numero <= 0)
              this.venta.numero = res.data.num;
          if (res.status <= 201) {
            this.$notify(
              "success",
              "Guadando factura",
              res.data.msj,
              { duration: 3000, permanent: false }
            );
          } else {
            this.$notify(
              "warning",
              "Guardando factura",
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
    imprimir() {
      //this.plantillaCompilada = Vue.compile(this.plantilla);
      if (this.venta.relItems.length > 0) {
        this.$htmlToPaper("prnFactura");
      }
    },
    pasarFoco() {
      if(this.selProducto != null) { 
        setTimeout(() => { 
          this.enfocarCantidad(); 
          if (this.venta.especie > 0 && this.venta.relItems.length <= 0 && 
            this.$route.params.servicioValor != undefined && 
            this.$route.params.servicioValor > 0 &&
            this.selProducto.precio <= 0) {
              this.productoSeleccion.precio = this.$route.params.servicioValor;
          }
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
        this.venta = this.original;
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
        this.productoSeleccion.precio > 0) {
        let item = {
          id: 0,
          venta_id: this.venta.id,
          movitem_id: this.venta.movimiento_id,
          producto_id: this.productoSeleccion.id,
          cantidad: this.productoSeleccion.cantidad,
          pedido: 0,
          precio: this.productoSeleccion.precio,
          costo: 0,
          descuento: this.productoSeleccion.descuento,
          adicional: 0,
          observacion: '',
          presentacion_id: 0, 
          lote_id: 0,
          relProducto: this.productoSeleccion.producto
        };
        this.venta.relItems.push(item);
        this.productoSeleccion = {
          cantidad: 0,
          nombre: "",
          indicaciones: "",
          productoid: 0,
          precio: 0,
          descuento: 0,
          producto: null,
          existencia: '0'
        };
        this.$refs.txProducto.focus();  
      }
    },
    eliminarItem(p) {
      if (this.venta.relItems.length == 1) {
        this.vaciarItems();
      } else {
        var ret = this.venta.relItems.filter(x => {
          return x.relProducto.id != p.item.relProducto.id;
        });
        this.venta.relItems = ret;  
      }
    },
    buscarProducto() {
      if (!this.lectura && this.productoSeleccion.nombre.length > 0) {
        this.$store.commit('inventarios/setSelProductoTexto', this.productoSeleccion.nombre);
        this.selProductoVer = true;
      }
    },
    vaciarItems() {
      this.venta.relItems = [];
    },
    validarCedula() {
      if (!this.lectura) {
        this.ocupadoCedula = true;
        this.$store
          .dispatch("maestros/clientePorCedula", this.venta.relCliente.identificacion)
          .then(function(r) {
            if (r.status == 200) {
              // presentar lista para elegir si hay mas de un resultado
              this.venta.cliente_id = r.data[0].id;
              this.venta.relCliente = r.data[0];
              this.verDatosCliente = false;
            }
            this.ocupadoCedula = false;
          }.bind(this))
          .catch(function(e) {
            this.$notify(
              "warning",
              "Atencion",
              "La cedula no se encuentra reistrada debe crear un cliente nuevo",
              { duration: 3000, permanent: false }
            );
            this.ocupadoCedula = false;
            this.verDatosCliente = true;
          }.bind(this));
      }
    },
    buscarCliente() {
      if (!this.lectura && this.venta.relCliente.nombres.length > 0) {
        this.$store.commit('maestros/setSelClienteTexto', this.venta.relCliente.nombres);
        this.selClienteVer = true;
      }
    },
    modificar() {
      this.original = this.venta;
      this.lectura = false;
    },
    imprimir() {
      this.$htmlToPaper("prnFactura");
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
          this.venta.movimiento_id = this.bodegas[0].id;
        }
      }.bind(this));
    // cargar sucursales  
    this.$store
      .dispatch("ajustes/sucursalesEmpresa", 1)
      .then(function(r) {
        if (r) {
          this.sucursales = r.data;
          if (this.sucursales.length > 0) {
            this.venta.sucursal_id = this.sucursales[0].id;
          }
        }
      }.bind(this));
    this.$store
      .dispatch("ajustes/plantillaPorTipo", 11)
      .then(function(r) {
        if (r) {
          if (r.data.length >= 1) {
            this.plantilla = r.data[0].definicion;
          }
        }
      }.bind(this));  
    if (this.$route.params.tipoId > 0)  {
      this.tipoDen = this.$route.params.tipo;
      this.tipoId = this.$route.params.tipoId;
    }
  },
  mounted() {
    if (this.$route.params.dato != null) {
      this.venta = {
        id: this.$route.params.dato.id,
        tipo: this.$route.params.dato.tipo,
        numero: this.$route.params.dato.numero,
        observaciones: this.$route.params.dato.observaciones,
        sucursal_id: this.$route.params.dato.sucursal_id,
        especie: this.$route.params.dato.especie,
        plazo: this.$route.params.dato.plazo,
        cliente_id: this.$route.params.dato.cliente_id,
        vendedor_id: this.$route.params.dato.vendedor_id,
        descuento_porcentaje: this.$route.params.dato.descuento_porcentaje,
        porcentaje_venta: this.$route.params.dato.porcentaje_venta,
        subtotal: this.$route.params.dato.subtotal, 
        subtotalex: this.$route.params.dato.subtotalex, 
        descuento: this.$route.params.dato.descuento, 
        recargo: this.$route.params.dato.recargo, 
        flete: this.$route.params.dato.flete, 
        impuestos: this.$route.params.dato.impuestos, 
        abonos: this.$route.params.dato.abonos, 
        estado: this.$route.params.dato.estado,
        movimiento_id: this.$route.params.dato.movimiento_id, 
        ecomprobante_id: this.$route.params.dato.ecomprobante_id, 
        operador: this.$route.params.dato.operador,
        estado: this.$route.params.dato.estado,
        relCliente: this.$route.params.dato.relCliente,
        relItems: this.$route.params.dato.relItems
        //relBodega: this.$route.params.dato.relBodega
      };
      if (this.$route.params.dato.fecha != undefined) {
        try {
          this.fechaProp = this.$moment(this.venta.fecha).toDate();
        } catch(e) {
          this.fechaProp = new moment.utc(this.venta.fecha).toDate();
        }
      } else {
        this.venta.fecha = null;
      }
    } else {
      this.venta.tipo = this.$route.params.tipoId;
      this.fechaProp = this.$moment().format('YYYY-MM-DD');
    } 
    if (this.$route.params.lectura != undefined) {
      this.lectura = this.$route.params.lectura;
    }
  }
}
</script>
