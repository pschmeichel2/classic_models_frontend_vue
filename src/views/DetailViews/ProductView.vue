<template>
    <div class="home">
        <v-card max-width="1000px"  >
            <v-card-title class="blue darken-2 ">
            <v-row class="ma-1">
                <span class="text-h5 white--text" >Product {{ $route.params.productCode }} ({{ product.productName }})</span>                        
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
                        <v-text-field label="productCode" v-model="product.productCode" dense class="font-weight-bold" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="productName" v-model="product.productName" dense class="font-weight-bold" readonly></v-text-field>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="4">
                        <v-text-field label="productLine" v-model="product.productLine" dense class="font-weight-bold"  readonly                      
                        prepend-icon="mdi-open-in-app"  @click:prepend="handleClickProductLine"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="productScale" v-model="product.productScale" dense readonly></v-text-field>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="4">
                        <v-text-field label="productVendor" v-model="product.productVendor" dense readonly></v-text-field>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="4">
                        <v-text-field label="quantityInStock" v-model="product.quantityInStock" dense readonly></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="buyPrice" v-model="product.buyPrice" dense readonly></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="msrp" v-model="product.msrp" dense readonly></v-text-field>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="12">
                        <v-textarea label="productDescription" rows="1" auto-grow v-model="product.productDescription" dense></v-textarea>
                    </v-col>
                </v-row>

            </v-card-text>
        </v-card>

        <p></p>
        <v-card flat  max-width="1000px" >

            <v-card-title class="grey darken-1 ">
                <v-row class="ma-0">
                    <span class="text-5 white--text" >OrderDetails</span>                        
                </v-row>
            </v-card-title>

            <v-data-table :items="orderDetails" :headers="orderDetailHeaders" item-key="productCode" dense class="elevation-3"
                :items-per-page="15" @click:row="handleClickOrderDetail">

                <template v-slot:item.orderNumber="{ item }">
                    <span class="font-weight-bold">{{ item.orderNumber }}</span>
                </template>
                <template v-slot:item.customerName="{ item }">
                    <span class="font-weight-bold">{{ item.customerName }}</span>
                </template>
                <template v-slot:item.priceEach="{ item }">
                    <span >{{ getPriceEach(item.priceEach) }}</span>
                </template>

            </v-data-table>
        </v-card>

    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
    name: 'ProductView',
    props: ['productCode'],
    data() {
      return {
        product: null,
        endpoint: 'http://localhost:8080/api/products/',      
        orderDetails: [],
        orderDetailHeaders: [
            {text: "orderNumber", value: "orderNumber", width: '5px',  class:"blue lighten-5"},
            {text: "orderLineNumber", value: "orderLineNumber", width: '5px',  class:"blue lighten-5"},
            {text: "customerName", value: "customerName", width: '250px',  class:"blue lighten-5"},
            //{text: "productCode", value: "productCode", width: '5px',  class:"blue lighten-5"},
            {text: "quantityOrdered", value: "quantityOrdered", width: '5px',  class:"blue lighten-5"},
            {text: "priceEach", value: "priceEach", width: '5px', align: 'right',  class:"blue lighten-5"},
            
        ],

      }
    },

    watch: {
        '$route'() {
            this.getProduct(this.productCode);
            this.getOrderDetails(this.productCode);
        }
    },

  created() {
    this.getProduct(this.productCode);
    this.getOrderDetails(this.productCode);
  },

  methods: {    

    getProduct(productCode) {
        axios(this.endpoint + productCode)
        .then(response => {
            this.product = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      getPriceEach(num) {
            return (Math.round(num * 100) / 100).toFixed(2);
        },

      getOrderDetails(productCode) {
            axios(this.endpoint + productCode + '/orderDetails')
            .then(response => {
                this.orderDetails = response.data
            })
            .catch( error => {
                console.log(error)
            })
        },

        handleClickOrderDetail(row) {
            console.log(row)
            router.push({path: `/orderDetails/${row.orderNumber}/${row.productCode}`})
        },

        handleClickProductLine () {
            router.push({path: `/productLines/${this.product.productLine}`});
        },

    },

}
</script>
  