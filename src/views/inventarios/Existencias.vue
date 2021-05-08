<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>Existencias de productos</h1>
      <piaf-breadcrumb />
      <div class="mb-2">
        <div class="d-block d-md-inline-block">
          <b-dropdown
            id="ddAtributoBusca"
            :text="`${bodegaTexto}`"
            variant="outline-primary"
            class="d-md-inline-block align-middle btn-group, mr-4 float-left"
            size="xs"
          >
            <b-dropdown-item v-for="item in bodegas" :key="item.id" @click="cambiarBodega(item)">
              {{ item.nombre }}
            </b-dropdown-item>
          </b-dropdown>
          <!--b-button @click="imprimir()" class="float-right">Imprimir</b-button-->
          <a 
            class="d-inline-block float-md-left ml-3 view-icon boton-comando"
            @click="actualizar()"
            v-b-tooltip.hover 
            title="Actualizar resultados"
          >
            <i class="mdi mdi-24px mdi-find-replace"/>
          </a>
          <a 
            class="d-inline-block float-md-left ml-3 view-icon boton-comando;"
            @click="imprimir()"
            v-b-tooltip.hover 
            title="Actualizar resultados"
          >
            <i class="mdi mdi-24px mdi-printer"/>
          </a>
          <div class="d-md-inline-block float-md-right">
            <b-checkbox switch
              v-model="verCeros" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle ml-5"
            >Ver productos sin stock</b-checkbox>
          </div>
        </div>
      </div>
    </b-colxx>
    <b-colxx id="prnExiste" xxs="12">
      <b-table responsive :items="items" :busy="busquedaEjecutando" :fields="campos">
        <template #table-busy>
          <table-busy mensaje="Consultando inventarios..." />
        </template>
        <template #cell(existencia)="fila">
          <div style="text-align: right;">
            {{ parseFloat(fila.item.ingresos) - parseFloat(fila.item.egresos) }}
          </div>  
        </template>
        <template #head(existencia)="data">
          <div style="text-align: right;">
            <span>{{ data.label }}</span>
          </div>
        </template>
      </b-table>
    </b-colxx>    
  </b-row>    
</template>
<script>
export default {
  data() {
    return {
      busquedaEjecutando: false,
      bodegas: [],
      bodegaTexto: '',
      verCeros: false,
      items: [],
      campos: [
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
          key: "existencia",
          sortable: true
        }
      ]
    }
  },
  methods: {
    imprimir() {
      this.$htmlToPaper("prnExiste");
    },
    actualizar() {
      this.busquedaEjecutando = true;
      this.items = [];
      let z = this.verCeros ? 1 : 0;  
      this.$store
        .dispatch("inventarios/existenciasCeros", {
          bodega: 1,
          zeros: z
        })
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.items = r.respuesta.data;
              this.busquedaEjecutando = false;
            }
          }
          this.busquedaEjecutando = false;
        }.bind(this));
    }
  },
  created() {
    this.$store
      .dispatch("inventarios/bodegasPorEstado", 0)
      .then(function(r) {
        this.bodegas = r.data;
        this.bodegaTexto = r.data[0].nombre;
      }.bind(this));  
    this.actualizar();
  }
}
</script>