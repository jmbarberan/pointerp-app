//import { isAuthGuardActive } from '../../constants/config'
import { setCurrentUser, getCurrentUser } from '../../utils'
import { apiSeguridad } from "@/rutas/seguridad";
//import { UserRole } from "@/utils/auth.roles";
import axios from 'axios';
const md5 = require("md5");

export default {
  state: {
    currentUser: getCurrentUser(), //isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess = true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess = true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    async login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true);
      commit("clinica/setMedicoUsuario", 0);
      var params = JSON.stringify({
        "usr": payload.usuario,
        "cla": md5(payload.clave)
      });
      return await axios.post(this.$app.appConfig.apiUrl + apiSeguridad.usuariosAcceso(), params)
        .then(function(r) {
          setCurrentUser(r.data);
          commit('setUser', r.data);
        })
        .catch(function(e) {
          setCurrentUser(null);
            commit('setError', e)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
        });
    },
    forgotPassword({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
    },
    resetPassword({ commit }, payload) {
      commit('clearError');
      commit('setProcessing', true);
    },
    signOut({ commit }) {
      setCurrentUser(null);
      // vaciar listas de cache de busquedas de ventanas
      commit("clinica/setMedicoUsuario", 0);
      commit('setLogout');
    }
  }
}
