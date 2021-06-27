<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <h1>Diario de ventas</h1>
        <piaf-breadcrumb />
        <div class="mb-2">
          <div class="d-block d-md-inline-block">
            <datepicker
              class="fecha-sm d-inline-block float-md-left mt-1 mr-3; vertical-alingn: middle;"
              :bootstrap-styling="true"
              v-model="busquedaDesde"
              format="yyyy/MM/dd"
              :language="es"
            ></datepicker>
            <datepicker
              class="fecha-sm d-inline-block float-md-left mt-1 vertical-alingn: middle"
              :bootstrap-styling="true"
              v-model="busquedaHasta"
              format="yyyy/MM/dd"
              :language="es"
            ></datepicker>
            <a 
              class="d-inline-block float-md-left ml-3 view-icon boton-comando"
              @click="buscar()"
              v-b-tooltip.hover 
              title="Actualizar resultados"
            >
              <i class="mdi mdi-24px mdi-find-replace"/>
            </a>
            <a 
              class="d-inline-block float-md-left ml-3 view-icon boton-comando"
              @click="imprimir()"
              v-b-tooltip.hover 
              title="Actualizar resultados"
            >
              <i class="mdi mdi-24px mdi-printer"/>
            </a>
            <!--b-button @click="imprimir()" class="float-right">Imprimir</b-button-->
          </div>
        </div>    
      </b-colxx>
    </b-row>
    <b-row id="prnDiario">
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <h5>Servicios</h5>
          <b-table
            ref="custom-table"
            class="vuetable"
            :fields="columnas"
            :items="ventaConsultas"
            :busy="busquedaEjecutando"
          >
            <template #table-busy>
              <table-busy mensaje="Ejecutando consulta..." />
            </template>
            <template #head(valor)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #cell(valor)="fila">
              <div style="text-align: right;">
                ${{ (parseFloat(fila.item.subtotal) + parseFloat(fila.item.subtotalex) + parseFloat(fila.item.recargo) + parseFloat(fila.item.flete) + parseFloat(fila.item.impuestos)) - parseFloat(fila.item.descuento) | dinero }}
              </div>
            </template>
          </b-table>
          <div style="text-align: right;">
            <span class="font-weight-semibold mr-4">Total Consultas</span>
            <span class="font-weight-semibold mr-2">$ {{ totalConsultas | dinero }}</span>
          </div>
          <h5>Productos</h5>
          <b-table
            ref="custom-table"
            class="vuetable"
            :fields="columnas"
            :items="ventaProductos"
          >
            <template #head(valor)="data">
              <div style="text-align: right;">
                {{ data.label }}
              </div>
            </template>
            <template #cell(valor)="fila">
              <div style="text-align: right;">
                ${{ (parseFloat(fila.item.subtotal) + parseFloat(fila.item.subtotalex) + parseFloat(fila.item.recargo) + parseFloat(fila.item.flete) + parseFloat(fila.item.impuestos)) - parseFloat(fila.item.descuento) | dinero }}
              </div>
            </template>
          </b-table>
          <div style="text-align: right;">
            <span class="font-weight-semibold mr-4">Total Productos</span>
            <span class="font-weight-semibold mr-2">$ {{ totalProductos | dinero }}</span>
          </div>
          <hr>
          <div style="text-align: right;">
            <span class="font-weight-semibold mr-4">TOTAL GENERAL</span>
            <span class="font-weight-semibold mr-2">$ {{ parseFloat(totalProductos) + parseFloat(totalConsultas) | dinero }}</span>
          </div>  
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import {es} from 'vuejs-datepicker/dist/locale'
export default {
  components: {
    Datepicker
  },
  data() {
    return {
      es: es,
      busquedaEjecutando: false,
      busquedaDesde: new Date(),
      busquedaHasta: new Date(),
      ventaProductos: [],
      ventaConsultas: [],
      ventas: [],
      columnas: [
        { 
          label: this.$t("vista.transacciones.campos.numero"), 
          key: "numero",
          sortable: true
        },
        { 
          label: this.$t("vista.transacciones.campos.fecha"), 
          key: "fecha",
          sortable: true,
        },
        {
          label: this.$t("vista.ventas.facturas.campos.cliente"), 
          key: "relCliente.nombres", 
          sortable: true 
        },
        {
          label: this.$t("vista.transacciones.campos.valor"), 
          key: "valor", 
          sortable: false,
        },
      ],
    }
  }, 
  filters: {
    dinero(val) {
      return val.toFixed(2);
    }
  },
  computed: {
    totalConsultas: function() {
      return this.ventaConsultas.reduce(
        (acc, item) => acc + (parseFloat(item.subtotal) + parseFloat(item.subtotalex) + parseFloat(item.recargo) + parseFloat(item.flete) + parseFloat(item.impuestos)) - parseFloat(item.descuento), 0
      );
    },
    totalProductos: function() {
      return this.ventaProductos.reduce(
        (acc, item) => acc + (parseFloat(item.subtotal) + parseFloat(item.subtotalex) + parseFloat(item.recargo) + parseFloat(item.flete) + parseFloat(item.impuestos)) - parseFloat(item.descuento), 0
      );
    }
  },
  methods: {
    buscar() {
      this.busquedaEjecutando = true;
      this.ventas = [];
      this.ventaConsultas = [];
      this.ventaProductos = [];
      this.$store
        .dispatch("ventas/ventasBuscarGrupo", { desde: this.busquedaDesde, hasta: this.busquedaHasta})
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.ventas = r.respuesta.data;
              this.ventaConsultas = this.ventas.filter(ven => ven.especie > 0);
              this.ventaProductos = this.ventas.filter(ven => ven.especie <= 0);
            }
          }
          this.busquedaEjecutando = false;
          if (this.ventas.length <= 0) {
            this.mensaje("No se encontraron resultados para esta busqueda.", "Buscar " + this.tipo, "warning");
          }
        }.bind(this))
        .catch(function(e) {
          console.log("Error");
          console.log(e);
          this.busquedaEjecutando = false;
          this.mensaje("No se encontraron resultados para esta busqueda.", "Buscar " + this.tipo , "warning");
        }.bind(this));
    },
    imprimir() {
      this.$htmlToPaper("prnDiario");
    }
  },
}
</script>