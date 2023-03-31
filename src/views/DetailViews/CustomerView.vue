<template>
    <div class="home">
      <v-card max-width="1000px"  >
        <v-card-title class="justify-center" ></v-card-title>

        <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Customer {{ $route.params.customerNumber }} ({{ customer.customerName }})</span>                        
                    <v-spacer></v-spacer>
                    <v-btn dark icon  @click="handleClickAdd"><v-icon >mdi-plus-thick</v-icon></v-btn>
                    <v-btn dark icon  @click="handleClickEdit"><v-icon >mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon  @click="handleClickDelete"><v-icon >mdi-delete</v-icon></v-btn>                
                </v-row>
        </v-card-title>
        <p></p>
        <v-card-text>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="Customer Name" v-model="customer.customerName" dense class="font-weight-bold"
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Customer Number" v-model="customer.customerNumber" dense
                    :readonly="true"></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="Contact Last Name" v-model="customer.contactLastName" dense class="font-weight-bold"
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Contact First Name" v-model="customer.contactFirstName" dense class="font-weight-bold"
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Phone" v-model="customer.phone" dense
                    :readonly="true"></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="AddressLine 1" v-model="customer.addressLine1" dense
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="AddressLine 2" v-model="customer.addressLine2" dense
                    :readonly="true"></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="City" v-model="customer.city" dense class="font-weight-bold"
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Country" v-model="customer.country" dense class="font-weight-bold"
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="State" v-model="customer.state" dense
                    :readonly="true"></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Postal Code" v-model="customer.postalCode" dense
                    :readonly="true"></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="4">
                <v-text-field label="SalesRep" v-if="this.customer.salesRepEmployeeName === null" v-model="getSalesRep" dense
                :readonly="true"></v-text-field>
                <v-text-field label="SalesRep" v-else v-model="getSalesRep" dense
                    prepend-icon="mdi-open-in-app"  @click:prepend="handleClickSalesRep"
                    :readonly="true"></v-text-field>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="4">
                    <v-text-field label="Credit Limit" v-model="customer.creditLimit" dense
                    :readonly="true"></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>
      </v-card>
      
        <p></p>

        <v-card max-width="1000px"  >
            <v-tabs>
                <v-tab>Orders</v-tab>  
                <v-tab>Payments</v-tab>  

                <v-tab-item :key="0">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text" >Orders</span>                        
                            </v-row>
                        </v-card-title>

                        <v-data-table :items="orders" :headers="orderHeaders" item-key="orderNumber" dense class="elevation-3"
                            :items-per-page="15" @click:row="handleClickOrder">
                            <template v-slot:item.orderDate="{ item }">
                                <span>{{ formatDate(item.orderDate)}}</span>
                            </template>
                            <template v-slot:item.requiredDate="{ item }">
                                <span>{{ formatDate(item.requiredDate)}}</span>
                            </template>
                            <template v-slot:item.shippedDate="{ item }">
                                <span>{{ formatDate(item.shippedDate) }}</span>
                            </template>
                            <template v-slot:item.status="{ item }">
                                <span class="font-weight-bold">{{ item.status }}</span>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-tab-item>

                <v-tab-item :key="1">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text" >Payments</span>                        
                            </v-row>
                        </v-card-title>

                        <v-data-table :items="payments" :headers="paymentHeaders" item-key="orderNumber" dense class="elevation-3"
                            :items-per-page="15" @click:row="handleClickPayment">

                            <template v-slot:item.checkNumber="{ item }">
                                <span class="font-weight-bold">{{ item.checkNumber }}</span>
                            </template>

                            <template v-slot:item.paymentDate="{ item }">
                                <span>{{ formatDate(item.paymentDate) }}</span>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-tab-item>

            </v-tabs>
        </v-card>
    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';
import Customer from '@/models/Customer';

export default {
    name: 'CustomerView',
    props: ['customerNumber'],
    data() {
      return {
        customer: new Customer(),
        endpoint: 'http://localhost:8080/api/customers/',      
        orders: [],
        payments: [],

        orderHeaders: [
            {text: "Order Number", value: "orderNumber", width: '5px',  class:"blue lighten-5"},
            {text: "Order Date", value: "orderDate", width: '5px', align: 'right',  class:"blue lighten-5"},
            {text: "Required Date", value: "requiredDate", width: '5px', align: 'right',  class:"blue lighten-5"},
            {text: "Shipped Date", value: "shippedDate", width: '5px', align: 'right',  class:"blue lighten-5"},
            {text: "Status", value: "status", width: '5px',  class:"blue lighten-5"},
            {text: "Comments", value: "comments", width: '500px',  class:"blue lighten-5"},
            //{text: "Customer Number", value: "customerNumber", width: '5px',  class:"blue lighten-5"},
          ],

          paymentHeaders: [
            //{text: "Customer Number", value: "customerNumber", width: '5px',  class:"blue lighten-5"},
            {text: "Check Number", value: "checkNumber", width: '5px',  class:"blue lighten-5"},
            {text: "Payment Date", value: "paymentDate", width: '5px', align: 'right',  class:"blue lighten-5"},
            {text: "Amount", value: "amount", width: '5px', align: 'right',  class:"blue lighten-5"},
        ],

      }
    },

    watch: {
        '$route'() {
            this.getCustomer(this.customerNumber);
            this.getOrders(this.customerNumber);
            this.getPayments(this.customerNumber);
        }
    },

  created() {
    this.getCustomer(this.customerNumber);
    this.getOrders(this.customerNumber);
    this.getPayments(this.customerNumber);
  },

  computed: {

    getSalesRep() {
        if( this.customer.salesRepEmployeeName === null ) {
            return "n/a";
        }
        return `${this.customer.salesRepEmployeeName} (${this.customer.salesRepEmployeeNumber})`;
    },


  },

  methods: {    

    getCustomer(customerNumber) {
        axios(this.endpoint + customerNumber)
        .then(response => {
            this.customer = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      getOrders(customerNumber) {
        axios(this.endpoint + customerNumber + '/orders')
        .then(response => {
            this.orders = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      getPayments(customerNumber) {
        axios(this.endpoint + customerNumber + '/payments')
        .then(response => {
            this.payments = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      handleClickOrder(row) {
        console.log(row)
        router.push({path: `/orders/${row.orderNumber}`})
      },

      handleClickPayment(row) {
        console.log(row)
        router.push({path: `/payments/${row.customerNumber}/${row.checkNumber}`})
      },

      handleClickSalesRep() {        
        router.push({path: `/employees/${this.customer.salesRepEmployeeNumber}`});
      },

      handleClickAdd() {
        console.log('handleClickAdd');
      },

      handleClickEdit() {
        console.log('handleClickEdit');
      },

      handleClickDelete() {
        console.log('handleClickDelete');
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
  