import { registrosPorTabla, sucursalesEmpresa, plantillaPorTipo } from "@/rutas/ajustes";
import axios from 'axios';

const ajustes = {
  namespaced: true,
  actions: {
    async registrosPorTabla(context, p) {
      let ruta = this.$app.appConfig.apiUrl + registrosPorTabla(p.id);
      const response = await axios.get(ruta)
        .catch(e => {
          return {
            id: -1, 
            respuesta: e
          };
        });
        return {
          id: 1,
          respuesta: response
        };
    },
    async sucursalesEmpresa(context, p) {
      let ruta = this.$app.appConfig.apiUrl + sucursalesEmpresa(p);
      return await axios.get(ruta);
    },
    async plantillaPorTipo(context, p) {
      return await axios.get(this.$app.appConfig.apiUrl + plantillaPorTipo(p));
    }
  }
}

export default ajustes;