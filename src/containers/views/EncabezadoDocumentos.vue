<template>
  <b-row>
    <b-colxx xxs="12">
      <h1>{{ titulo }}</h1>
      <div class="top-right-button-container">
        <b-button
          @click="crear()"
          variant="primary"
          size="sm"
          class="top-right-button"
        >{{ $t('vista.comandos.nuevo') }}</b-button>
      </div>
      <piaf-breadcrumb />
      <div class="mb-2">
        <div class="d-block d-md-inline-block">
          <span class="mr-3 d-inline-block float-md-left">
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===0}"
              @click="cambiarBuscaTipo(0)"
              v-b-tooltip.hover 
              :title="`${titulo} de hoy`"
            >
              <i class="mdi mdi-24px mdi-clock-outline"/>
            </a>
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===1}"
              @click="cambiarBuscaTipo(1)"
              v-b-tooltip.hover 
              title="Buscar por fecha"
            >
              <i class="mdi mdi-24px mdi-calendar-month"/>
            </a>
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===2}"
              @click="cambiarBuscaTipo(2)"
              v-b-tooltip.hover 
              title="Buscar por concepto"
            >
              <i class="mdi mdi-24px mdi-clipboard-text-outline"/>
            </a>
            <a 
              :class="{'mr-1 view-icon boton-bloque':true,'activo': busquedaTipo===3}"
              @click="cambiarBuscaTipo(3)"
              v-b-tooltip.hover 
              title="Buscar por numero"
            >
              <i class="mdi mdi-24px mdi-pound"/>
            </a>
          </span>
          <div v-if="busquedaTipo == 2 || busquedaTipo == 3" class="search-sm d-inline-block float-md-left mr-1 mt-1">
            <b-form-input v-model="busquedaTexto" :placeholder="$t('vista.comandos.buscar')" @keyup.enter="(val) => buscar(val)"/>
          </div>
          <datepicker v-if="busquedaTipo == 1"
            class="fecha-sm d-inline-block float-md-left mt-1 mr-3"
            :bootstrap-styling="true"
            v-model="busquedaDesde"
            format="yyyy/MM/dd"
            :language="es"
          ></datepicker>
          <datepicker v-if="busquedaTipo == 1"
            class="fecha-sm d-inline-block float-md-left mt-1"
            :bootstrap-styling="true"
            v-model="busquedaHasta"
            format="yyyy/MM/dd"
            :language="es"
          ></datepicker>
          <a 
            class="d-inline-block float-md-left ml-3 view-icon boton-comando"
            @click="actualizar()"
            v-b-tooltip.hover 
            title="Actualizar resultados"
          >
            <i class="mdi mdi-24px mdi-find-replace"/>
          </a>
        </div>
        <div class="d-md-inline-block float-md-right">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-md-none"
            v-b-toggle.displayOptions
          >
            {{ $t('pages.display-options') }}
            <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <b-checkbox switch v-if="busquedaTipo == 2"
              v-model="busquedaExtendida"
              theme="custom"
              color="primary-inverse"
              class="vue-switcher-small d-md-inline-block align-middle mr-3"
            >
              {{ $t("vista.busqueda.extendida") }}
            </b-checkbox>
            <b-checkbox switch
              v-model="busquedaEliminados" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle mr-4"
            >
              {{ $t("vista.busqueda.eliminados") }}
            </b-checkbox>
            <b-dropdown
              id="ddAtributoBusca"
              :text="`${controlItemTexto}`"
              variant="outline-primary"
              class="d-md-inline-block align-middle btn-group, mr-4"
              size="xs"
            >
              <b-dropdown-item v-for="item in controlItems" :key="item.id" @click="busquedaCambiarAtributo(item)">
                {{ item.nombre }}
              </b-dropdown-item>
            </b-dropdown>
            <span class="text-muted text-small mr-1 mb-2">{{desde}} {{ $t('vista.busqueda.al') }} {{hasta}} {{ $t('vista.busqueda.de') }} {{ total }}</span>
            <b-dropdown
              id="ddown2"
              right
              :text="`${xPagina}`"
              variant="outline-secundary"
              class="d-inline-block"
              size="xs"
            >
              <b-dropdown-item
                v-for="(size,index) in lPaginas"
                :key="index"
                @click="cambiarPagina(size)"
              >{{ size }}</b-dropdown-item>
            </b-dropdown>
          </b-collapse> 
        </div>
      </div>
    </b-colxx>
  </b-row>    
</template>
  
<script>
  import Datepicker from "vuejs-datepicker";
  import {es} from 'vuejs-datepicker/dist/locale'
  import { mapGetters } from 'vuex';
  export default {
  props: [
    "titulo",
    "crear",
    "buscar",
    "desde",
    "hasta",
    "total",
    "xPagina",
    "lPaginas",
    "cambiarPagina",
    "actualizar",
    "tipo"
  ],
  data: function() {
    return {
      es: es,
    }
  },
  components: {
    Datepicker
  },
  computed: {
    ...mapGetters([
      'buscaMovimientosExtendida',
      'buscaMovimientosEliminados',
      'buscaMovimientosDesde',
      'buscaMovimientosHasta',
      'buscaMovimientosTipo',
      'buscaMovimientosTexto',
      'buscaMovimientosControlItems',
      'buscaMovimientosAtributo'
    ]),
    controlItemTexto: {
      get () {
        if (this.buscaMovimientosAtributo != null)
          return this.buscaMovimientosAtributo.nombre
        else
          return "Seleccionar"  
      }
    },
    busquedaTexto: {
      get () {
        return this.buscaMovimientosTexto;
      },
      set (val) {
        this.$store.commit('setBuscaMovimientosTexto', val);
      }
    },
    busquedaExtendida: {
      get: function() {
        return this.buscaMovimientosExtendida;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosExtendida", val);
      }
    },
    busquedaEliminados: {
      get: function() {
        return this.buscaMovimientosEliminados;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosEliminados", val);
      }
    },
    busquedaDesde: {
      get: function() {
        return this.buscaMovimientosDesde;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosDesde", val);
      }
    },
    busquedaHasta: {
      get: function() {
        return this.buscaMovimientosHasta;
      },
      set: function(val) {
        this.$store.commit("setBuscaMovimientosHasta", val);
      }
    },
    busquedaTipo: {
      get: function() {
        return this.buscaMovimientosTipo;
      }
    },
    controlItems: {
      get: function() {
        return this.buscaMovimientosControlItems;
      }
    }
  },
  methods: {
    busquedaCambiarAtributo(atrib) {
      this.$store.commit("setBuscaMovimientosAtributo", atrib);
    },
    cambiarBuscaTipo(p) {
      this.$store.commit("setBuscaMovimientosTipo", p);
    },
    fechaSeleccionada(p) {
      this.$refs[p].hide(true);
    }
  },
}
</script>
