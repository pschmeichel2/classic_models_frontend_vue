<template>
    <div class="home">
        
    
      <v-card max-width="1400px"  >
        <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
            <span class="text-h5 white--text" >Customers</span>    
            <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>        
        </v-row>
        </v-card-title>

        <v-data-table :items="customers" :headers="headers" item-key="customerNumber" dense class="elevation-3"
              :items-per-page="15" @click:row="handleClick"  :search="search">

          <template v-slot:item.customerName="{ item }">
            <span class="font-weight-bold">{{ item.customerName }}</span>
          </template>
          <template v-slot:item.contactLastName="{ item }">
            <span class="font-weight-bold">{{ item.contactLastName }}</span>
          </template>
          <template v-slot:item.contactFirstName="{ item }">
            <span class="font-weight-bold">{{ item.contactFirstName }}</span>
          </template>
          <template v-slot:item.city="{ item }">
            <span class="font-weight-bold">{{ item.city }}</span>
          </template>
          <template v-slot:item.country="{ item }">
            <span class="font-weight-bold">{{ item.country }}</span>
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
    name: 'CustomersView',    
    data() {
      return {        
        search: '',
        customers: [],
        endpoint: 'http://localhost:8080/api/customers',        
        headers: [
                {text: "Customer Number", value: "customerNumber", width: '50px',  class:"blue lighten-5"},
                {text: "Customer Name", value: "customerName", width: '150px',  class:"blue lighten-5"},
                {text: "Contact LastName", value: "contactLastName", width: '5px',  class:"blue lighten-5"},
                {text: "Contact FirstName", value: "contactFirstName", width: '5px',  class:"blue lighten-5"},
                {text: "Phone", value: "phone", width: '150px',  class:"blue lighten-5"},
                {text: "Address Line1", value: "addressLine1", width: '150px',  class:"blue lighten-5"},
                {text: "Address Line2", value: "addressLine2", width: '5px',  class:"blue lighten-5"},
                {text: "City", value: "city", width: '5px',  class:"blue lighten-5"},
                {text: "State", value: "state", width: '5px',  class:"blue lighten-5"},
                {text: "Postal Code", value: "postalCode", width: '5px',  class:"blue lighten-5"},
                {text: "Country", value: "country", width: '5px',  class:"blue lighten-5"},
                {text: "Sales Rep", value: "salesRepEmployeeName", width: '5px',  class:"blue lighten-5"},
                {text: "Credit Limit", value: "creditLimit", width: '5px', align: 'right',  class:"blue lighten-5"},
          ],
      }
    },

    watch: {
        '$route'() {
            this.getCustomers();
        }
    },

  created() {
    this.getCustomers();
  },

  methods: {    

    getCustomers() {
        axios(this.endpoint)
        .then(response => {
            this.customers = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

    handleClick(row) {
      console.log(row)
      router.push({path: `/customers/${row.customerNumber}`})
    },

    handleClickRefresh() {
      this.getCustomers();
    },

  },

}
</script>
