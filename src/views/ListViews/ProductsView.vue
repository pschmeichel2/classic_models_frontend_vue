<template>
  <div class="home">

    <v-card max-width="1500px">

      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text" id="header">Products</span>
          <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
        </v-row>
      </v-card-title>

      <v-data-table :items="products" :headers="headers" item-key="productCode" dense class="elevation-3"
        :items-per-page="15" @click:row="handleClick" :search="search">

        <template v-slot:item.productName="{ item }">
          <span class="font-weight-bold">{{ item.productName }}</span>
        </template>
        <template v-slot:item.productLine="{ item }">
          <span class="font-weight-bold">{{ item.productLine }}</span>
        </template>
        <template v-slot:item.buyPrice="{ item }">
          <span>{{ getBuyPrice(item.buyPrice) }}</span>
        </template>
        <template v-slot:item.msrp="{ item }">
          <span>{{ getMSRP(item.msrp) }}</span>
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
  name: 'ProductsView',
  title: 'Classic Models - Products',
  data() {
    return {
      search: '',
      products: [],
      endpoint: process.env.VUE_APP_BASE_URL+'/products',

      showSnackbar: false,
      snackbarText: '',
      snackbarTimeout: 2000,

      headers: [
        { text: "Product Code", value: "productCode", width: '5px', class: "blue lighten-5" },
        { text: "Product Name", value: "productName", width: '50px', class: "blue lighten-5" },
        { text: "Product Line", value: "productLine", width: '5px', class: "blue lighten-5" },
        { text: "Product Scale", value: "productScale", width: '5px', class: "blue lighten-5" },
        { text: "Product Vendor", value: "productVendor", width: '50px', class: "blue lighten-5" },
        { text: "Product Description", value: "productDescription", width: '500px', class: "blue lighten-5" },
        { text: "Quantity in Stock", value: "quantityInStock", width: '5px', align: 'right', class: "blue lighten-5" },
        { text: "Buy Price", value: "buyPrice", width: '5px', align: 'right', class: "blue lighten-5" },
        { text: "MSRP", value: "msrp", width: '5px', align: 'right', class: "blue lighten-5" },
      ],
    }
  },

  watch: {
    '$route'() {
      this.getProducts();
    }
  },

  created() {
    this.showSnackbar = false;
    this.snackbarText = '';
    this.getProducts();
  },

  methods: {

    getProducts() {
      axios(this.endpoint)
        .then(response => {
          this.products = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    handleClick(row) {
      console.log(row);
      router.push({ path: `/products/${row.productCode}` });
    },

    handleClickRefresh() {
      this.getProducts();
    },

    handleClickAdd() {
      console.log('handleClickAdd');
      this.showSnackbar = true;
      this.snackbarText = 'not implemented';
    },

    getBuyPrice(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    },

    getMSRP(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    },

  },
}
</script>
