<template>
  <div class="home">

    <v-card max-width="1200px">
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text">Order Details</span>
          <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
        </v-row>
      </v-card-title>

      <v-data-table :items="orderDetails" :headers="headers" item-key="id" dense class="elevation-3" :items-per-page="15"
        @click:row="handleClick" :search="search">

        <template v-slot:item.customerName="{ item }">
          <span class="font-weight-bold">{{ item.customerName }}</span>
        </template>
        <template v-slot:item.productName="{ item }">
          <span class="font-weight-bold">{{ item.productName }}</span>
        </template>
        <template v-slot:item.priceEach="{ item }">
          <span>{{ getPriceEach(item.priceEach) }}</span>
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
  name: 'OrderDetailsView',
  title: 'Classic Models - Order Details',
  data() {
    return {
      search: '',
      orderDetails: [],

      showSnackbar: false,
      snackbarText: '',
      snackbarTimeout: 2000,

      endpoint: process.env.VUE_APP_BASE_URL+'/orderDetails',
      headers: [
        { text: "Order Number", value: "orderNumber", width: '50px', class: "blue lighten-5" },
        { text: "OrderLine Number", value: "orderLineNumber", width: '50px', class: "blue lighten-5" },
        { text: "Customer Name", value: "customerName", width: '250px', class: "blue lighten-5" },
        { text: "Product Code", value: "productCode", width: '60px', class: "blue lighten-5" },
        { text: "Product Name", value: "productName", width: '300px', class: "blue lighten-5" },
        { text: "Quantity Ordered", value: "quantityOrdered", width: '50px', align: 'right', class: "blue lighten-5" },
        { text: "Price Each", value: "priceEach", width: '50px', align: 'right', class: "blue lighten-5" },

      ],
    }
  },

  watch: {
    '$route'() {
      this.getOrderDetails();
    }
  },

  created() {
    this.showSnackbar = false;
    this.snackbarText = '';
    this.getOrderDetails();
  },

  methods: {

    getOrderDetails() {
      axios(this.endpoint)
        .then(response => {
          this.orderDetails = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    handleClick(row) {
      console.log(row);
      router.push({ path: `/orderDetails/${row.orderNumber}/${row.productCode}` });
    },

    handleClickRefresh() {
      this.getOffices();
    },

    handleClickAdd() {
      console.log('handleClickAdd');
      this.showSnackbar = true;
      this.snackbarText = 'Please switch to orders to manage their order details.';
    },

    getPriceEach(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    },

  },
}
</script>
