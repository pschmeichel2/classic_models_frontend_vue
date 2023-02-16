<template>
    <div class="home">
              
      <v-card max-width="1200px"  >
        <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
            <span class="text-h5 white--text" >Order Details</span>    
            <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>        
        </v-row>
        </v-card-title>

        <v-data-table :items="orderDetails" :headers="headers" item-key="id" dense class="elevation-3"
              :items-per-page="15"  @click:row="handleClick"   :search="search">

          <template v-slot:item.customerName="{ item }">
            <span class="font-weight-bold">{{ item.customerName }}</span>
          </template>
          <template v-slot:item.productName="{ item }">
            <span class="font-weight-bold">{{ item.productName }}</span>
          </template>

          <template v-slot:footer.prepend>
            <v-btn plain @click="handleClickRefresh">Refresh</v-btn>             
          </template>

        </v-data-table>  
      </v-card>

    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
    name: 'OrderDetailsView',
    data() {
      return {        
        search: '',
        orderDetails: [],
        endpoint: 'http://localhost:8080/api/orderDetails',        
        headers: [
            {text: "Order Number", value: "orderNumber", width: '50px',  class:"blue lighten-5"},
            {text: "OrderLine Number", value: "orderLineNumber", width: '50px',  class:"blue lighten-5"},
            {text: "Customer Name", value: "customerName", width: '250px',  class:"blue lighten-5"},
            {text: "Product Code", value: "productCode", width: '60px',  class:"blue lighten-5"},
            {text: "Product Name", value: "productName", width: '300px',  class:"blue lighten-5"},
            {text: "Quantity Ordered", value: "quantityOrdered", width: '50px',  class:"blue lighten-5"},
            {text: "Price Each", value: "priceEach", width: '50px', align: 'right',  class:"blue lighten-5"},
            
        ],
      }
    },

    watch: {
        '$route'() {
            this.getOrderDetails();
        }
    },

  created() {
    this.getOrderDetails();
  },

  methods: {    
    
    getOrderDetails() {
        axios(this.endpoint)
        .then(response => {
            this.orderDetails = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

    handleClick(row) {
      console.log(row)
      router.push({path: `/orderDetails/${row.orderNumber}/${row.productCode}`})
    },

    handleClickRefresh() {
      this.getOffices();
    },

  },
}
</script>
