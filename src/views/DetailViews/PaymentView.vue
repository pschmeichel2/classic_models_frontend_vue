<template>
    <div class="home">
      <v-card max-width="1000px"  >

        <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Payment {{ payment.customerNumber }}/{{ payment.checkNumber }}</span>                        
                    <v-spacer></v-spacer>
                    <v-btn dark icon  @click="handleClickAdd"><v-icon >mdi-plus-thick</v-icon></v-btn>
                    <v-btn dark icon  @click="handleClickEdit"><v-icon >mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon><v-icon >mdi-delete</v-icon></v-btn>                
                </v-row>
        </v-card-title>

        <p></p>

        <v-card-text>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="customerNumber" v-model="payment.customerNumber" dense  class="font-weight-bold" readonly
                    prepend-icon="mdi-open-in-app"  @click:prepend="handleClickCustomer">></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="checkNumber" v-model="payment.checkNumber" dense  class="font-weight-bold" readonly></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="paymentDate" v-model="getPaymentDate" dense readonly></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="amount" v-model="payment.amount" dense readonly></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
    name: 'PaymentView',
    props: ['customerNumber', 'checkNumber'],
    data() {
      return {
        payment: null,
        endpoint: 'http://localhost:8080/api/payments/',      
      }
    },

    watch: {
        '$route'() {
            this.getPayment(this.customerNumber, this.checkNumber );
        }
    },

  created() {
    this.getPayment(this.customerNumber, this.checkNumber);
  },

  computed: {
    getPaymentDate() {
          if( this.payment === null ) {
              return '';
          }          
          return this.formatDate(this.payment.paymentDate);
      },

  },

  methods: {    

    getPayment(customerNumber, checkNumber) {
        axios(this.endpoint + customerNumber+'/'+checkNumber)
        .then(response => {
            this.payment = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      handleClickCustomer () {
            router.push({path: `/customers/${this.payment.customerNumber}`});
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
  