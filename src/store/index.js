import Vue from 'vue';
import Vuex from 'vuex';
import app from '../main';
import menu from './modules/menu';
import user from './modules/user';
import modClinica from "./modules/clinica";
import modAjustes from "./modules/ajustes";
import modInventarios from "./modules/inventarios";
import modSeguridad from "./modules/seguridad";
import modVentas from "./modules/ventas";
import modMaestros from "./modules/maestros";
import { setCurrentLanguage } from '../utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    empresaAccedida: {
      id: 1,
      nombre: "Ecuamedica",
      direccion: "Cdla. La Florida Norte Mz. 116 Solar 3",
      telefonos: "(04)-2250623",
    },
    remotoConfig: "",
    /*remotoConfig: {
      headers : {
        Authorization: ""
      },
      withCredentials: false,
      crossorigin: true
    }*/
    movimientoBuscador: {
      texto: "",
      desde: null,
      hasta: null,
      tipo: 0,
      extendida: false,
      eliminados: false,
      atributo: null,
      controlItems: []
    },
    /*api: {
      ruta: this._vm
    }*/
  },
  getters: {
    buscaMovimientosTexto: state => state.movimientoBuscador.texto,
    buscaMovimientosDesde: state => state.movimientoBuscador.desde,
    buscaMovimientosHasta: state => state.movimientoBuscador.hasta,
    buscaMovimientosTipo: state => state.movimientoBuscador.tipo,
    buscaMovimientosAtributo: state => state.movimientoBuscador.atributo,
    buscaMovimientosExtendida: state => state.movimientoBuscador.extendida,
    buscaMovimientosEliminados: state => state.movimientoBuscador.eliminados,
    buscaMovimientosControlItems: state => state.movimientoBuscador.controlItems,
  },
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      setCurrentLanguage(payload);
    },
    setRemotoConfigToken(state, t) {
      state.remotoConfig.headers.Authorization = t;
    },

    setBuscaMovimientosDesde(state, p) {
      state.movimientoBuscador.desde = p;
    },
    setBuscaMovimientosHasta(state, p) {
      state.movimientoBuscador.hasta = p;
    },
    setBuscaMovimientosTipo(state, p) {
      state.movimientoBuscador.tipo = p;
    },
    setBuscaMovimientosAtributo(state, p) {
      state.movimientoBuscador.atributo = p;
    },
    setBuscaMovimientosTexto(state, p) {
      state.movimientoBuscador.texto = p;
    },
    setBuscaMovimientosExtendida(state, p) {
      state.movimientoBuscador.extendida = p;
    },
    setBuscaMovimientosEliminados(state, p) {
      state.movimientoBuscador.eliminados = p;
    },
    setBuscaMovimientosControItems(state, p) {
      state.movimientoBuscador.controlItems = p;
    },
  },
  actions: {
    setLang({ commit }, payload) {
      commit('changeLang', payload)
    }
  },
  modules: {
    menu,
    user,
    clinica: modClinica,
    ajustes: modAjustes,
    inventarios: modInventarios,
    seguridad: modSeguridad,
    ventas: modVentas,
    maestros: modMaestros
  }
})
