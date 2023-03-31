<template>
    <div class="home">
      <v-card max-width="1000px"  >
        <v-card-title class="justify-center" ></v-card-title>

        <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Order Detail {{ $route.params.orderNumber }}/{{ $route.params.productCode }}</span>                        
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
                  <v-text-field label="Order Number" v-model="orderDetail.orderNumber" dense class="font-weight-bold"
                    prepend-icon="mdi-open-in-app"  @click:prepend="handleClickOrder"
                    :readonly="true"></v-text-field>
              </v-col>
              <v-col cols="4">
                  <v-text-field label="Order Line Number" v-model="orderDetail.orderLineNumber" dense
                  :readonly="true"></v-text-field>
              </v-col>
          </v-row>
          <v-row >
              <v-col cols="4">
                  <v-text-field label="Product Code" v-model="orderDetail.productCode" dense class="font-weight-bold" 
                  prepend-icon="mdi-open-in-app"  @click:prepend="handleClickProduct" :readonly="true"></v-text-field>
              </v-col>
              <v-col cols="6">
                  <v-text-field label="Product Name" v-model="orderDetail.productName" dense class="font-weight-bold" 
                  prepend-icon="mdi-open-in-app"  @click:prepend="handleClickProduct" :readonly="true"></v-text-field>
              </v-col>
          </v-row>
          <v-row >
              <v-col cols="4">
                  <v-text-field label="Quantity Ordered" v-model="orderDetail.quantityOrdered" dense class="font-weight-bold"
                  :readonly="true"></v-text-field>
              </v-col>
              <v-col cols="4">
                  <v-text-field label="Price Each" v-model="getPriceEach" dense class="font-weight-bold"
                  :readonly="true"></v-text-field>
              </v-col>
            </v-row>
        </v-card-text>

      </v-card>
    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';
import OrderDetail from '@/models/OrderDetail';

export default {
    name: 'OrderDetailView',
    props: ['orderNumber','productCode'],
    data() {
      return {
        orderDetail: new OrderDetail(),
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

  computed: {
    getPriceEach() {
          if( this.orderDetail === null ) {
              return '';
          }          
          return this.getAmount(this.orderDetail.priceEach);

      },

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

      handleClickAdd() {
        console.log('handleClickAdd');
      },

      handleClickEdit() {
        console.log('handleClickEdit');
      },

      handleClickDelete() {
        console.log('handleClickDelete');
      },

      getAmount(num) {
            return (Math.round(num * 100) / 100).toFixed(2);
        },

    },

}
</script>
  