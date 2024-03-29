<template>
  <div class="home">
    <v-card max-width="1000px">

      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text" id="header">Payment {{ payment.customerNumber }}/{{ payment.checkNumber }}</span>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
          <v-btn dark icon @click="handleClickEdit"><v-icon>mdi-pencil</v-icon></v-btn>
          <v-btn dark icon @click="handleClickDelete"><v-icon>mdi-delete</v-icon></v-btn>
        </v-row>
      </v-card-title>

      <p></p>

      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field label="Customer Number" v-model="payment.customerNumber" dense class="font-weight-bold" readonly
              prepend-icon="mdi-open-in-app" @click:prepend="handleClickCustomer">></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field label="Check Number" v-model="payment.checkNumber" dense class="font-weight-bold"
              readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field label="Payment Date" v-model="getPaymentDate" dense readonly></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field label="Amount" v-model="getAmount" dense readonly></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

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
import Payment from '@/models/Payment';

export default {
  name: 'PaymentView',
  props: ['customerNumber', 'checkNumber'],
  data() {
    return {
      payment: new Payment(),
      endpoint: process.env.VUE_APP_BASE_URL+'/payments/',
      showSnackbar: false,
      snackbarText: '',
      snackbarTimeout: 2000,
    }
  },

  watch: {
    '$route'() {
      this.getPayment(this.customerNumber, this.checkNumber);
    }
  },

  created() {
    this.showSnackbar = false;
    this.snackbarText = '';
    this.getPayment(this.customerNumber, this.checkNumber);
  },

  computed: {
    getPaymentDate() {
      if (this.payment === null) {
        return '';
      }
      return this.formatDate(this.payment.paymentDate);
    },

    getAmount() {
      if (this.payment === null) {
        return '';
      }
      return this.getFormattedAmount(this.payment.amount);

    },

  },

  methods: {

    getPayment(customerNumber, checkNumber) {
      axios(this.endpoint + customerNumber + '/' + checkNumber)
        .then(response => {
          this.payment = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },

    handleClickCustomer() {
      router.push({ path: `/customers/${this.payment.customerNumber}` });
    },

    handleClickAdd() {
      console.log('handleClickAdd');
      this.showSnackbar = true;
      this.snackbarText = 'not implemented';
    },

    handleClickEdit() {
      console.log('handleClickEdit');
      this.showSnackbar = true;
      this.snackbarText = 'not implemented';
    },

    handleClickDelete() {
      console.log('handleClickDelete');
      this.showSnackbar = true;
      this.snackbarText = 'not implemented';
    },

    getFormattedAmount(num) {
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
  