<template>
  <div class="d-flex flex-row mb-3">
    <div class="pl-3 pt-2 pr-2 pb-2">
      <h6>{{ consulta.relServicio.relEspecialidad.descripcion }}</h6>
      <h6>{{ consulta.relServicio.descripcion }}</h6>
      <div class="text-primary text-small font-weight-medium d-none d-sm-block">{{ consulta.fecha }}</div>
      <div v-if="consulta.sintomas_subjetivos.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">Sintomas</span> {{ consulta.sintomas_subjetivos }}</p>
      </div>
      <div v-if="consulta.diagnostico_descripcion.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">Diagnostico</span> {{ consulta.diagnostico_descripcion }}</p>
      </div>
      <div v-if="consulta.tratamiento.length > 0" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">Tratamiento</span> {{ consulta.tratamiento }}</p>
      </div> 
      <div v-if="consulta.relMedico != null" class="pr-4">
        <p class="mb-1 text-small"><span class="text-muted theme-color-1">Profesional</span> {{ consulta.relMedico.nombres }}</p>
      </div>
      <p class="mb-1 text-small"><span class="text-muted theme-color-1">Signos Vitales: </span> {{ traerMediciones() }}</p>
      <p class="mb-1 text-small"><span class="text-muted theme-color-1">Examenes: </span> {{ traerExamenes() }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'consulta'
  ],
  data() {
    return {
      examenes: []
    }
  },
  methods: {
    traerMediciones () {
      if (this.$props.consulta.mediciones.length > 10) {
        try {
          const med = JSON.parse(this.$props.consulta.mediciones);
          let txt = ''
          if (med.peso != undefined && med.peso.length > 0) {
            txt +=  `Peso: ${med.peso} (kg) `
          }
          if (med.estatura != undefined && med.estatura.length > 0) {
            txt += `Estatura: ${med.estatura} (cm) `
          }
          if (med.temperatura != undefined && med.temperatura.length > 0) {
            txt += `Temperatura: ${med.temperatura} (°C) `
          }
          if (med.critmo != undefined && med.critmo.length > 0) {
            txt += `R. Cardiaco: ${med.critmo} (xMin) `
          }
          if (med.rritmo != undefined && med.rritmo.length > 0) {
            txt += `Frq. Respiratoria: ${med.rritmo} (xMin) `
          }
          if (med.oxigeno != undefined && med.oxigeno.length > 0) {
            txt += `% Oxigeno: ${med.oxigeno} (%) `
          }
          if (med.imc != undefined && med.imc.length > 0) {
            txt += `I. Masa Corpo.: ${med.imc} `
          }
          if (med.saturaciono2 != undefined && med.saturaciono2.length > 0) {
            txt += `Saturacion Oxigeno: ${med.saturaciono2}`
          }
          return txt;
        } catch(e) {
          return this.consulta.mediciones;
        }
      }
    },
    traerExamenes () {
      let ret = ''
      if (this.$props.consulta.relExamenes != undefined && this.$props.consulta.relExamenes.length > 0) {
        this.$props.consulta.relExamenes.forEach(ex => {
          let sel = ex.seleccionados.trimLeft().split(" ")
          sel.forEach(e => {
            let l = this.examenes.find(t => t.id === e)
            if (l) {
              ret += " " + l.denominacion
            }
          });
        });
      }
      if (this.$props.consulta.examenes) {
        ret += this.$props.consulta.examenes.trim()
      }
      console.log(ret)
      return ret.trimLeft()
    }
  },
  created() {
    this.examenes = this.$store.state.clinica.examenesCache
  }
}
</script>