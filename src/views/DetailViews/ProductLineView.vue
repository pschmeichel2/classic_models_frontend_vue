<template>
    <div class="home">
      <v-card max-width="1000px"  >

        <v-card-title class="blue darken-2 ">
          <v-row class="ma-1">
              <span class="text-h5 white--text" >Product Line {{ $route.params.productLine }}</span>                        
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
                  <v-text-field label="Product Line" v-model="productLineData.productLine" dense class="font-weight-bold"></v-text-field>
              </v-col>
          </v-row>
          <v-row >
              <v-col cols="12">
                  <v-textarea rows="1" auto-grow label="Text Description" v-model="productLineData.textDescription" dense></v-textarea>
              </v-col>
          </v-row>
          <v-row>
              <v-col cols="4">
                  <v-text-field label="HTML Description" v-model="productLineData.htmlDescription" dense></v-text-field>
              </v-col>
              <v-col cols="4">
                  <v-text-field label="Image" v-model="productLineData.image" dense></v-text-field>
              </v-col>
          </v-row>

        </v-card-text>
      </v-card>
      <p></p>
      <v-card flat>

        <v-card-title class="grey darken-1 ">
                <v-row class="ma-0">
                    <span class="text-5 white--text" >Products</span>                        
                </v-row>
            </v-card-title>

        <v-data-table :items="products" :headers="productHeaders" item-key="productCode" dense class="elevation-3"
            :items-per-page="15" @click:row="handleClickProduct">

          <template v-slot:item.productCode="{ item }">
            <span class="font-weight-bold">{{ item.productCode }}</span>
          </template>
          <template v-slot:item.productName="{ item }">
            <span class="font-weight-bold">{{ item.productName }}</span>
          </template>
          <template v-slot:item.productLine="{ item }">
            <span class="font-weight-bold">{{ item.productLine }}</span>
          </template>
          <template v-slot:item.productVendor="{ item }">
            <span class="font-weight-bold">{{ item.productVendor }}</span>
          </template>

        </v-data-table>
      </v-card>

    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
    name: 'ProductLineView',
    props: ['productLine'],
    data() {
      return {
        productLineData: null,
        endpoint: 'http://localhost:8080/api/productLines/',      
        products: [],
        productHeaders: [
            {text: "Product Code", value: "productCode", width: '5px',  class:"blue lighten-5"},
            {text: "Product Name", value: "productName", width: '50px',  class:"blue lighten-5"},
            //{text: "Product Line", value: "productLine", width: '5px',  class:"blue lighten-5"},
            {text: "Product Scale", value: "productScale", width: '5px',  class:"blue lighten-5"},
            {text: "Product Vendor", value: "productVendor", width: '50px',  class:"blue lighten-5"},
            {text: "Product Description", value: "productDescription", width: '500px',  class:"blue lighten-5"},
            {text: "Quantity in Stock", value: "quantityInStock", width: '5px',  class:"blue lighten-5"},
            {text: "Buy Price", value: "buyPrice", width: '5px', align: 'right', class:"blue lighten-5"},
            {text: "MSRP", value: "msrp", width: '5px', align: 'right',  class:"blue lighten-5"},
          ],

      }
    },

    watch: {
        '$route'() {
            this.getProductLine(this.productLine);
            this.getProducts(this.productLine);
        }
    },

  created() {
    this.getProductLine(this.productLine);
    this.getProducts(this.productLine);
  },

  methods: {    

    getProductLine(productLine) {
        axios(this.endpoint + productLine)
        .then(response => {
            this.productLineData = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

      getProducts(productLine) {
            axios(this.endpoint + productLine + '/products')
            .then(response => {
                this.products = response.data
            })
            .catch( error => {
                console.log(error)
            })
        },

        handleClickProduct(row) {
            console.log(row)
            router.push({path: `/products/${row.productCode}`})
        },

    },

}
</script>
  