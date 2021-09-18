import { clientePorCedula, clientesPorNombre } from "@/rutas/maestros";
import axios from 'axios';

const maestros = {
  namespaced: true,
  state: {
    clienteSeleccionador: {
      texto: "",
      seleccionado: null,
      extendida: false
    },
    tablasBuscador: {
      texto: "",
      extendida: false,
      eliminados: false,
      atributo: "",
      atributoIdx: 0,
      cacheAtributo: '',
      cacheAtributoIdx: 0
    },
  },
  getters: {
    selClienteTexto: state => state.clienteSeleccionador.texto,
    selCliente: state => state.clienteSeleccionador.seleccionado,

    busquedaAtributo: state => state.tablasBuscador.atributo,
    buscaTablaTexto: state => state.tablasBuscador.texto,
    buscaTablaExtendida: state => state.tablasBuscador.extendida,
    buscaTablaEliminados: state => state.tablasBuscador.eliminados,
  },
  mutations: {
    setSelClienteTexto(state, p) {
      state.clienteSeleccionador.texto = p;
    },
    setSelCliente(state, p) {
      state.clienteSeleccionador.seleccionado = p;
    },

    setBuscaTablasTexto(state, p) {
      state.tablasBuscador.texto = p;
    },
    setBuscaTablasExtendida(state, p) {
      state.tablasBuscador.extendida = p;
    },
    setBuscaTablasEliminados(state, p) {
      state.tablasBuscador.eliminados = p;
    },
    setBusquedaAtributo(state, p) {
      state.tablasBuscador.atributo = p;
    },
    setBusquedaAtributoIdx(state, p) {
      state.tablasBuscador.atributoIdx = p;
    },

    setCacheBusquedaTablasAtributo(state, p) {
      state.tablasBuscador.cacheAtributo = p;
    },
    setCacheBusquedaTablasAtributoIdx(state, p) {
      state.tablasBuscador.cacheAtributoIdx = p;
    },
  },
  actions: {
    async clientePorCedula(context, ced) {
      return await axios.get(this.$app.appConfig.apiUrl + clientePorCedula(ced));
    },
    async clientesPorNombre(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + clientesPorNombre(p.estado, p.texto, context.rootState.empresaAccedida.id));
    },
  }
}

export default maestros;