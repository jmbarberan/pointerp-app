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
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'consulta'
  ]
}
</script>