<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.clinica.examenes')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" >
        <b-table :fields="campos" :items="recetas" :key="id">
          <template #cell(comandos)="fila">
            <span
              class="span-comando pt-1"
              @click="eliminar(fila)"
              v-b-tooltip.hover
              title="Imprimir orden de examen"
            ><i class="mdi mdi-printer mdi-18px"/></span>
          </template>
        </b-table>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      campos: [
        { key: 'comandos', label: 'Acciones', sortable: false },
        { key: 'fecha', label: 'Fecha', sortable: false },
        { key: 'paciente', label: 'Paciente', sortable: false },
        { key: 'medico', label: 'Profesional', sortable: false },
      ],
      recetas: [
        { id: 1, paciente: 'PEREZ SUAREZ ANA ELIZABETH', medico: 'DR. HEBERT MUÑOZ MARTINEZ', fecha: '25-Mar-2021' },
        { id: 2, paciente: 'BARBERAN GUILLEN JOSE MARTIN', medico: 'Administrador', fecha: '25-Mar-2021' }
      ]
    }
  }

}
</script>
