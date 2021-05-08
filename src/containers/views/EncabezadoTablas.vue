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
        <div class="d-block d-md-inline-block pt-1">
          <b-dropdown
            id="ddAtributoBusca"
            :text="`${$t('vista.busqueda.etiqueta')} ${busquedaAtributoProp}`"
            variant="outline-primary"
            class="mr-2 float-md-left btn-group, mt-1"
            size="xs"
          >
            <b-dropdown-item v-for="(atrib,index) in busquedaAtributos" :key="index" @click="busquedaCambiarAtributo(index)">
              {{ atrib }}
            </b-dropdown-item>
          </b-dropdown>

          <div class="search-sm d-inline-block float-md-left mr-1 align-center mt-1">
            <b-form-input v-model="busquedaTexto" :placeholder="$t('vista.comandos.buscar')" @keyup.enter="(val) => buscar(val)"/>
          </div>
          <a 
            class="d-inline-block float-md-left ml-3 view-icon"
            @click="buscar()"
            v-b-tooltip.hover 
            title="Buscar"
          >
            <i class="mdi mdi-24px mdi-find-replace"/>
          </a>
        </div>
        <div class="float-md-right pt-1">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-md-none"
            v-b-toggle.displayOptions
          >
            {{ $t('pages.display-options') }}
            <i class="simple-icon-arrow-down align-middle" />
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <b-checkbox switch 
              v-model="busquedaExtendida" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle mr-3"
            >{{ $t("vista.busqueda.extendida") }}</b-checkbox>
            <b-checkbox switch 
              v-model="busquedaEliminados" 
              theme="custom" 
              color="primary-inverse" 
              class="vue-switcher-small d-md-inline-block align-middle mr-3"
            >{{ $t("vista.busqueda.eliminados") }}</b-checkbox>
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
import { mapGetters } from 'vuex';
export default {
  props: [
    "titulo",
    "busquedaAtributos",
    "crear",
    "buscar",
    "desde",
    "hasta",
    "total",
    "xPagina",
    "lPaginas",
    "cambiarPagina"
  ],
  computed: {
    ...mapGetters('clinica', [
      'buscaPacienteTexto',
      'buscaPacienteExtendida',
      'buscaPacienteEliminados',
      'busquedaAtributo'
    ]),
    busquedaTexto: {
      get () {
        return this.buscaPacienteTexto;
      },
      set (value) {
        this.$store.commit('clinica/setBuscaTablasTexto', value)
      }
    },
    busquedaExtendida: {
      get: function() {
        return this.buscaPacienteExtendida;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaTablasExtendida", val);
      }
    },
    busquedaEliminados: {
      get: function() {
        return this.buscaPacienteEliminados;
      },
      set: function(val) {
        this.$store.commit("clinica/setBuscaTablasEliminados", val);
      }
    },
    busquedaAtributoProp: {
      get: function() {
        return this.busquedaAtributo;
      }
    }
  },
  methods: {
    busquedaCambiarAtributo(id) {
      this.$store.commit("clinica/setBusquedaAtributo", this.busquedaAtributos[id]);
      this.$store.commit("clinica/setBusquedaAtributoIdx", id);
    }
  },
}

</script>
