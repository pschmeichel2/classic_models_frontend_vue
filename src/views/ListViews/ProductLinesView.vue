<template>
  <div class="home">

    <v-card max-width="1400px">

      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text" id="header">Product Lines</span>
          <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
        </v-row>
      </v-card-title>

      <v-data-table :items="productLines" :headers="headers" item-key="productLine" dense class="elevation-3"
        :items-per-page="15" @click:row="handleClick" :search="search">

        <template v-slot:item.productLine="{ item }">
          <span class="font-weight-bold">{{ item.productLine }}</span>
        </template>

        <template v-slot:footer.prepend>
          <v-btn plain @click="handleClickRefresh">Refresh</v-btn>
        </template>

      </v-data-table>

      <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" light centered multi-line>
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
        </template>
      </v-snackbar>

    </v-card>

  </div>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
  name: 'ProductLinesView',
  title: 'Classic Models - Product Lines',
  data() {
    return {
      search: '',
      productLines: [],

      showSnackbar: false,
      snackbarText: '',
      snackbarTimeout: 2000,

      endpoint: process.env.VUE_APP_BASE_URL+'/productLines',
      headers: [
        { text: "Product Line", value: "productLine", width: '5px', class: "blue lighten-5" },
        { text: "Text Description", value: "textDescription", width: '500px', class: "blue lighten-5" },
        { text: "HTML Description", value: "htmlDescription", width: '5px', class: "blue lighten-5" },
        { text: "Image", value: "image", width: '5px', class: "blue lighten-5" },
      ],
    }
  },

  watch: {
    '$route'() {
      this.getProductLines();
    }
  },

  created() {
    this.showSnackbar = false;
    this.snackbarText = '';
    this.getProductLines();
  },

  methods: {

    getProductLines() {
      axios(this.endpoint)
        .then(response => {
          this.productLines = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    handleClick(row) {
      console.log(row);
      router.push({ path: `/productLines/${row.productLine}` });
    },

    handleClickRefresh() {
      this.getProductLines();
    },

    handleClickAdd() {
      console.log('handleClickAdd');
      this.showSnackbar = true;
      this.snackbarText = 'not implemented';
    },

  },
}
</script>
