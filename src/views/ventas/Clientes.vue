<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.ventas.clientes')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" >
          <b-table></b-table>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>