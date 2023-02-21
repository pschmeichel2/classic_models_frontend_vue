<template>
    <div class="home">
      <v-card max-width="1000px"  >
        <v-card-title class="justify-center" ></v-card-title>

        <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >OrderDetail {{ $route.params.orderNumber }}/{{ $route.params.productCode }}</span>                        
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
                  <v-text-field label="Order Number" v-model="orderDetail.orderNumber" dense class="font-weight-bold"
                    prepend-icon="mdi-open-in-app"  @click:prepend="handleClickOrder"></v-text-field>
              </v-col>
              <v-col cols="4">
                  <v-text-field label="Order Line Number" v-model="orderDetail.orderLineNumber" dense></v-text-field>
              </v-col>
          </v-row>
          <v-row >
              <v-col cols="4">
                  <v-text-field label="Product Code" v-model="orderDetail.productCode" dense class="font-weight-bold" 
                  prepend-icon="mdi-open-in-app"  @click:prepend="handleClickProduct"></v-text-field>
              </v-col>
              <v-col cols="6">
                  <v-text-field label="Product Name" v-model="orderDetail.productName" dense class="font-weight-bold" 
                  prepend-icon="mdi-open-in-app"  @click:prepend="handleClickProduct"></v-text-field>
              </v-col>
          </v-row>
          <v-row >
              <v-col cols="4">
                  <v-text-field label="Quantity Ordered" v-model="orderDetail.quantityOrdered" dense class="font-weight-bold"></v-text-field>
              </v-col>
              <v-col cols="4">
                  <v-text-field label="Price Each" v-model="orderDetail.priceEach" dense class="font-weight-bold"></v-text-field>
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
    name: 'OrderDetailView',
    props: ['orderNumber','productCode'],
    data() {
      return {
        orderDetail: null,
        endpoint: 'http://localhost:8080/api/orderDetails/',      
      }
    },

    watch: {
        '$route'() {
            this.getOrderDetail(this.orderNumber, this.productCode);
        }
    },

  created() {
    this.getOrderDetail(this.orderNumber, this.productCode);
  },

  methods: {    
    getOrderDetail(orderNumber, productCode) {
        axios(this.endpoint + orderNumber + '/'+productCode)
        .then(response => {
            this.orderDetail = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      handleClickOrder() {        
        router.push({path: `/orders/${this.orderNumber}`});
      },

      handleClickProduct() {        
        router.push({path: `/products/${this.productCode}`});
      },

    },

}
</script>
  