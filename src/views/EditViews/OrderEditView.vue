<template>
    <div class="home">
        <v-card max-width="1000px"  >

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Order Entry</span>                        
                    <v-spacer></v-spacer>
                </v-row>
            </v-card-title>

            <p></p>
            <v-card-text>
                <v-row >
                    <v-col cols="2">
                        <v-text-field label="Order Date" type="date" v-model = "order.orderDate" dense></v-text-field>
                        {{ this.order.orderDate }} (Test Databinding)
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Customer Name" v-model="order.customerName" dense class="font-weight-bold"
                        required maxlength="50"  :rules="[rules.required, rules.customerNameCounter]" counter                        
                        disabled></v-text-field>                        
                    </v-col>
                    <v-col cols="1">
                        <v-btn  color="primary" @click="handleClickFindCustomer"><v-icon>mdi-account-search</v-icon>Find Customer</v-btn>                                    
                    </v-col>
                </v-row>

                <v-row >
                    <v-col cols="2">
                        <v-text-field label="Required Date" type="date" v-model="order.requiredDate" dense></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="order.status" :items="statusValues" label="Status" dense></v-select>                        
                    </v-col>
                </v-row>                
                <v-row>            
                    <v-col cols="2">
                        <v-text-field label="Shipped Date" type="date" v-model="order.shippedDate" dense></v-text-field>
                    </v-col>
                    <v-col cols="8">
                        <v-textarea rows="1" auto-grow label="comments" v-model="order.comments" dense></v-textarea>
                    </v-col>
                </v-row>

                <v-row>            
                    <v-btn color="primary" @click="handleClickFindProduct"><v-icon>mdi-car-search</v-icon>Find Product</v-btn>
                </v-row>           
                <p></p>
            </v-card-text>

        </v-card>
        <p></p>
        <v-card flat max-width="1000px"  >

            <v-card-title class="grey darken-1 ">
                <v-row class="ma-0">
                    <span class="text-5 white--text" >Order Details</span>   
                    <v-spacer></v-spacer>
                    <v-btn dark icon @click="handleClickAddOrderDetail"><v-icon>mdi-plus-thick</v-icon></v-btn>        
                     
                </v-row>
            </v-card-title>

            <v-data-table :items="orderDetails" :headers="orderDetailHeaders" item-key="productCode" dense class="elevation-3"
                :items-per-page="15" >

                <template v-slot:item.productCode="{ item }">
                    <span class="font-weight-bold">{{ item.productCode }}</span>
                </template>
                <template v-slot:item.productName="{ item }">
                    <span class="font-weight-bold">{{ item.productName }}</span>
                </template>
                <template v-slot:item.priceEach="{ item }">
                    <span >{{ getPriceEach(item.priceEach) }}</span>
                </template>

            </v-data-table>

            <v-card-text>               
            </v-card-text>

        </v-card>
        <CustomerSearchDialog ref="theCustomerSearchDialog" />
        <ProductSearchDialog ref="theProductSearchDialog" />
        <OrderDetailEditDialog ref="theOrderDetailEditDialog" />
    </div>
  </template>


<script>
import axios from 'axios';
import router from '@/router';
import CustomerSearchDialog from '../EditViews/CustomerSearchDialog.vue';
import ProductSearchDialog from '../EditViews/ProductSearchDialog.vue';
import OrderDetailEditDialog from '../EditViews/OrderDetailEditDialog.vue';
import Order from '../../models/Order.js';
import { eventBus } from "../../main";
import OrderDetail from '@/models/OrderDetail';

export default {
    name: 'OrderView',
    props: ['orderNumber'],
    components: {
        CustomerSearchDialog,
        ProductSearchDialog,
        OrderDetailEditDialog,
    },
    data() {
      return {
        order: new Order(),
        statusValues: [
        'in process',
        'shipped', 
        'on hold', 
        'resolved', 
        'disputed', 
        ],
        endpoint: 'http://localhost:8080/api/orders/',      
        orderDetails: [],
        //sortBy: 'orderLineNumber',
        orderDetailHeaders: [
            {text: "Order LineNumber", value: "orderLineNumber", width: '10px', class:"blue lighten-5"},            
            {text: "Product Code", value: "productCode", width: '40px',  class:"blue lighten-5"},
            {text: "Product Name", value: "productName", width: '200px',  class:"blue lighten-5"},
            {text: "Quantity Ordered", value: "quantityOrdered", width: '20px', align: 'right',  class:"blue lighten-5"},
            {text: "Price Each", value: "priceEach", width: '20px', align: 'right',  class:"blue lighten-5"},
        ],
        rules: {
            required: value => !!value || 'Required.',
            customerNameCounter: value => value.length <= 50 || 'Max 50 characters',
        }

      }
    },

    created() {
        // https://stackoverflow.com/questions/48794066/vuejs-how-to-bind-a-datetime
        
        this.order.orderDate = this.getDateNow();
        this.order.requiredDate = this.getDateNow();
        this.order.shippedDate = '';
        this.order.customerName = 'Baane Mini Imports';
        this.order.status = 'in process';

        const firstOrderDetail = new OrderDetail('S10_4698', 
            '2003 Harley-Davidson Eagle Drag Bike',
            123,
            91.02 );
        //new OrderDetail({productCode:'1'});
        this.orderDetails = [];
        this.orderDetails.push(firstOrderDetail);

        eventBus.$on("customer-selected", (data) => {
            this.order.customerName = data.customerName;   
            this.order.customerNumber = data.customerNumber;         
        });
        console.log('created');              
    },

    methods: {   

        handleClickFindCustomer() {    
            console.log('handleClickFindCustomer');              
            this.$refs.theCustomerSearchDialog.open();      
        },

        handleClickFindProduct() {                        
            this.$refs.theProductSearchDialog.open();      
        },

        handleClickAddOrderDetail() {                        
            this.$refs.theOrderDetailEditDialog.open();      
        },

        getPriceEach(num) {
            return (Math.round(num * 100) / 100).toFixed(2);
        },

        getDateNow() {
           const now = new Date();
           return this.getDateAsString(now);
        },

        getDateAsString(theDate) {
           const year = theDate.getFullYear().toString();
           var month = (theDate.getMonth() +1).toString();
           if( month.length === 1 ) {
                month = '0'+month;
           }
           var day = theDate.getDate().toString();
           if( day.length === 1 ) {
            day = '0'+day;
           }
           const nowAsString = year + '-' + month + '-' + day;
           return nowAsString;
        },
    },
}
</script>
