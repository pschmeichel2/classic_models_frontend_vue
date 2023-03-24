<template>
  <div class="home">
            
    <v-card max-width="1000px">

      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
            <span class="text-h5 white--text" >Payments</span>    
            <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>        
        </v-row>
        </v-card-title>


      <v-data-table :items="payments" :headers="headers" item-key="checkNumber" dense class="elevation-3"
            :items-per-page="15"  @click:row="handleClick"   :search="search">

        <template v-slot:item.checkNumber="{ item }">
            <span class="font-weight-bold">{{ item.checkNumber }}</span>
        </template>

        <template v-slot:item.paymentDate="{ item }">
            <span>{{ formatDate(item.paymentDate) }}</span>
        </template>
        <template v-slot:item.amount="{ item }">
            <span >{{ getAmount(item.amount) }}</span>
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
import Payment from '@/models/Payment';

export default {
    name: 'PaymentsView',
    title: 'Classic Models - Payments',
    data() {
      return {        
        search: '',
        payments: [],
        endpoint: 'http://localhost:8080/api/payments',        
        headers: [
            {text: "Customer Number", value: "customerNumber", width: '5px',  class:"blue lighten-5"},
            {text: "Check Number", value: "checkNumber", width: '5px',  class:"blue lighten-5"},
            {text: "Payment Date", value: "paymentDate", width: '5px', class:"blue lighten-5"},
            {text: "Amount", value: "amount", width: '5px', align: 'right',  class:"blue lighten-5"},
        ],
      }
    },

    watch: {
      '$route'() {
        this.getPayments();
      }
    },

  created() {
    this.getPayments();
  },

  methods: {    

    getPayments() {
      axios(this.endpoint)
      .then(response => {
          this.payments = response.data
      })
      .catch( error => {
          console.log(error)
      })
    },

    handleClick(row) {
      console.log(row)
      router.push({path: `/payments/${row.customerNumber}/${row.checkNumber}`})
    },

    handleClickRefresh() {
      this.getPayments();
    },

    handleClickAdd() {
      console.log('handleClickAdd')
    },

    getAmount(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    },

    formatDate(date) {
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
