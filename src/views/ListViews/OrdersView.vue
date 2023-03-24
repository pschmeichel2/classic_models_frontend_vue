<template>
    <div class="home">
        
      <v-card max-width="1400px">
        <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
            <span class="text-h5 white--text" >Orders</span>    
            <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>        
        </v-row>
        </v-card-title>

        <v-data-table :items="orders" :headers="headers" item-key="orderNumber" dense class="elevation-3"
            :items-per-page="15"  @click:row="handleClick"   :search="search">

            <template v-slot:item.orderDate="{ item }">
              <span class="font-weight-bold">{{ formatDate(item.orderDate) }}</span>
            </template>
            <template v-slot:item.requiredDate="{ item }">
              <span>{{ formatDate(item.requiredDate) }}</span>
            </template>
            <template v-slot:item.shippedDate="{ item }">
              <span>{{ formatDate(item.shippedDate) }}</span>
            </template>
            <template v-slot:item.status="{ item }">
                <span class="font-weight-bold">{{ item.status }}</span>
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
    name: 'OrdersView',
    title: 'Classic Models - Orders',
    data() {
      return {        
        search: '',
        orders: [],
        endpoint: 'http://localhost:8080/api/orders',        
        headers: [
            {text: "Order Number", value: "orderNumber", width: '30px',  class:"blue lighten-5"},
            {text: "Order Date", value: "orderDate", width: '30px', align: 'right',  class:"blue lighten-5"},
            {text: "Required Date", value: "requiredDate", width: '30px', align: 'right',  class:"blue lighten-5"},
            {text: "Shipped Date", value: "shippedDate", width: '30px', align: 'right',  class:"blue lighten-5"},
            {text: "Status", value: "status", width: '20px',  class:"blue lighten-5"},
            {text: "Comments", value: "comments", width: '400px',  class:"blue lighten-5"},            
            {text: "Customer Name", value: "customerName", width: '200px',  class:"blue lighten-5"},
            //{text: "CustomerNumber", value: "customerNumber", width: '20px',  class:"blue lighten-5"},
          ],
      }
    },

    watch: {
        '$route'() {
            this.getOrders();
        }
    },

  created() {
    this.getOrders();
  },

  methods: {    

    getOrders() {
      axios(this.endpoint)
      .then(response => {
          this.orders = response.data
      })
      .catch( error => {
          console.log(error)
      })
    },

    handleClick(row) {
      console.log(row)
      router.push({path: `/orders/${row.orderNumber}`})
    },

    handleClickAdd() {
        router.push({path: `/orders/new`});
    },

    handleClickRefresh() {
      this.getOrders();
    },

    formatDate(date) {
      if( date === null ) {
        return null;
      }
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [day, month, year].join('.');            
    },


  },
}
</script>
