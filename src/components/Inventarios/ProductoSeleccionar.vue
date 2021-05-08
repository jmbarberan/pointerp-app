<template>
  <div>
    <b-form-input 
      ref="txBuscar"
      v-model="busquedaTexto"
      size="sm"
      :placeholder='$t("vista.comandos.buscar")'
      @keyup.enter="pulsaEnter"
      @keyup.ctrl.stop.prevent="pulsaControl"
      class="mb-4"
    />
    <b-table
      ref="tbItems"
      small
      :per-page="porPagina"
      :fields="campos"
      striped
      hover
      :items="items"
      select-mode="single"
      selectable
      selected-variant="primary"
      :current-page="paginaActual"
      :selected="seleccionado"
      @row-selected="filaSeleccionada"
      :busy="busquedaEjecutando"
    ></b-table>
    <b-pagination
      ref="paginador"
      v-model="paginaActual"
      :total-rows="total"
      :per-page="porPagina"
      @change="cambiarPagina()"
      size="sm"
      align="center"
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      paginaActual: 1,
      seleccionado: null,
      campos: [
        { key: "nombre", label: this.$t('vista.inventarios.productos.campos.nombre'), sortable: false },
        { key: "medida", label: this.$t('vista.inventarios.productos.campos.medida'), sortable:false }
      ],
      items: [],
      filasPagina: [],
      busquedaEjecutando: false,
      porPagina: 5,
      selIndex: -1
    }
  },
  computed: {
    ...mapGetters('inventarios', [
      'selProductoTexto'
    ]),
    busquedaTexto: {
      get () {
        return this.selProductoTexto;
      },
      set (value) {
        this.$store.commit('inventarios/setSelProductoTexto', value);
      }
    },
    total() {
      if (!this.busquedaEjecutando) {
        return this.items.length;
      } else {
        return  0;
      }
    },
    paginas() {
      return Math.ceil(this.total / this.porPagina);
    }
  },
  methods: {
    pulsaEnter() {
      if (this.busquedaTexto.length > 0) 
        this.buscar();
    },
    pulsaControl(ev) {
      switch (ev.keyCode) {
        case 13: {
          if (this.seleccionado != null)
            this.$emit("buscadorProd-seleccionado");
          break;
        }
        case 32: {
          if ((this.filasPagina.length -1) > this.selIndex)
            this.selIndex += 1; // Saltar seleccion
          else
            this.selIndex = 0;  
          this.filasPagina[this.selIndex].click();
          break;
        }
        case 37: {
          try {
            this.paginaActual -= 1;
          } catch {

          }
          break;
        }
        case 39: {
          try {
            this.paginaActual += 1;
          } catch {

          }
          break;
        }
      }
    },
    buscar() {
      this.busquedaEjecutando = true;
      this.items = [];
      this.paginaActual = 1;
      let p = {
        tipo: 0,
        atributo: 0,
        estado: 0,
        texto: this.busquedaTexto
      }
      this.$store
        .dispatch("inventarios/productosBuscarMin", p)
        .then(function(r) {
          if (r.id == 1) {
            if (r.respuesta.data != undefined) {
              this.selIndex = -1;
              this.items = r.respuesta.data;
              let tabla = this.$refs.tbItems.$el;
              let tbo = tabla.getElementsByTagName('tbody')[0];
              this.filasPagina = tbo.getElementsByTagName('tr');
            }
          }
          this.busquedaEjecutando = false;
          if (this.items.length > 0) {
            this.paginaActual = 1;
          }
        }.bind(this))
        .catch(function() {
          this.busquedaEjecutando = false;
        }.bind(this));
    },
    filaSeleccionada(p) {
      this.seleccionado = p[0];
      this.$store.commit("inventarios/setSelProducto", this.seleccionado);
    },
    saltarSeleccionado() {
      this.selIndex += 1;
      this.$refs.tbItems.selectRow(this.selIdex);
    },
    cambiarPagina() {
      this.selIndex = -1;
      let tabla = this.$refs.tbItems.$el;
      let tbo = tabla.getElementsByTagName('tbody')[0];
      this.filasPagina = tbo.getElementsByTagName('tr');
    }
  },
  created() {
    if (this.selProductoTexto.length > 0) {
      this.buscar();
    }
  }
}
</script>
