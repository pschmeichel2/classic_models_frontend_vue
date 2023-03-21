<template>
    <v-dialog v-model="show" max-width="1400px">          
        <v-card>            

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Find Product</span>                        
                    <v-spacer></v-spacer>
                </v-row>                
            </v-card-title>

            <p></p>

            <v-card-text>

                <v-card>
                    <v-card-text>
                        <v-row >
                            <v-col cols="2">
                                <v-text-field label="Product Code" dense v-model="productCode"
                                maxlength="15" :rules="[rules.productCodeCounter]" counter
                                @keyup.enter="find()" ref="productCodeRef"/>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field label="Product Name" dense v-model="productName"
                                maxlength="70" :rules="[rules.productNameCounter]" counter
                                @keyup.enter="find()"/>
                            </v-col>
                        </v-row><v-row >
                            <v-col cols="2">
                                <v-select label="Product Line" dense v-model="productLine"
                                :items="productLineValues" 
                                clearable @keyup.enter="find()"></v-select>    
                            </v-col>
                            <v-col cols="3">
                                <v-select label="Vendor" dense v-model="productVendor"
                                :items="productVendorValues" 
                                clearable @keyup.enter="find()"></v-select>    
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="find" type="submit">Find</v-btn>
                    </v-card-actions>
                </v-card>

                <p></p>

                <v-card>
                    <v-card-text>
                        <v-data-table :items="products" :headers="productHeaders" item-key="productCode" dense class="elevation-3"
                            :items-per-page="15" @click:row="handleClickProduct"
                            height="350px" v-model="selected" ref="productTableRef"
                            :single-select="true"  show-select
                            @dblclick:row="($event, {item})=>handleDblClickProduct(item)">

                        <template v-slot:item.productCode="{ item }">
                            <span class="font-weight-bold">{{ item.productCode }}</span>
                        </template>
                        <template v-slot:item.productName="{ item }">
                            <span class="font-weight-bold">{{ item.productName }}</span>
                        </template>

                        <template v-slot:item.buyPrice="{ item }">
                            <span >{{ formatCurrency(item.buyPrice) }}</span>
                        </template>
                        <template v-slot:item.msrp="{ item }">
                            <span >{{ formatCurrency(item.msrp) }}</span>
                        </template>

                        </v-data-table>

                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="secondary" @click="close" text>Cancel</v-btn>
                        <v-btn color="primary" @click="submit" type="submit">Ok</v-btn>
                    </v-card-actions>

                </v-card>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../../main";

export default {
    name: 'ProductSearchDialog',
    data() {
        return {      
            endpoint: 'http://localhost:8080/api/products',
            productLinesEndpoint: 'http://localhost:8080/api/productLineNames',
            productVendorsEndpoint: 'http://localhost:8080/api/productVendors',
            show: false,
            selected: [],
            productCode: '',
            productName: '',
            productLine: '',
            productVendor: '',
            products: [],
            productLineValues: [],
            productVendorValues: [],
            productHeaders: [
                {text: "Product Code", value: "productCode", width: '25px',  class:"blue lighten-5"},
                {text: "Product Name", value: "productName", width: '250px',  class:"blue lighten-5"},
                {text: "Product Line", value: "productLine", width: '35px',  class:"blue lighten-5"},
                {text: "Product Scale", value: "productScale", width: '25px',  class:"blue lighten-5"},
                {text: "Product Vendor", value: "productVendor", width: '150px',  class:"blue lighten-5"},
                //{text: "Product Description", value: "productDescription", width: '500px',  class:"blue lighten-5"},
                {text: "Quantity in Stock", value: "quantityInStock", align: 'right', width: '25px',  class:"blue lighten-5"},
                {text: "Buy Price", value: "buyPrice", width: '25px', align: 'right', class:"blue lighten-5"},
                {text: "MSRP", value: "msrp", width: '25px', align: 'right',  class:"blue lighten-5"},
            ],
        rules: {            
            productCodeCounter: value => value.length <= 15 || 'Max 15 characters',
            productNameCounter: value => value.length <= 70 || 'Max 70 characters',            
            },

        }
    },

    methods: {

        formatCurrency (value) {
            return (value).toFixed(2);
        },

        open: function () {
            var vm = this;
            vm.show = true;            
            this.productCode = '';
            this.productName = '';
            this.productLine = '';
            this.productVendor = '';
            this.products = [];
            this.productLineValues = [];
            this.productVendorValues = [];
            this.getProductLines();
            this.getProductVendors();
            setTimeout(() => {
              this.$refs.productCodeRef.$refs.input.select();
            });
        },

        submit: function () {
            console.log('submit');
            const row = this.selected[0];
            eventBus.$emit("product-selected", row);     
            this.show = false;
        }, 

        find: function () {
            this.getProducts();
        }, 

        close: function () {            
            this.show = false;
        }, 

        getProducts() {
            console.log('getProducts()');
            const request = this.endpoint
                + '?productCode='+ (this.productCode === null ? '' : this.productCode.trim())
                + '&productName=' + (this.productName === null ? '' : this.productName.trim())
                + '&productLine=' + (this.productLine === null ? '' : this.productLine.trim())
                + '&productVendor=' + (this.productVendor === null ? '' : this.productVendor.trim());
            axios(request)
            .then(response => {
                this.products = response.data;
                if( this.products.length > 0 ) {
                    const firstProduct = this.products[0];
                    this.selected = [firstProduct];
                }
            })
            .catch( error => {
                console.log(error);
            });
        },

        getProductLines() {
            console.log('getProductLines()');
            const request = this.productLinesEndpoint;
            axios(request)
            .then(response => {
                this.productLineValues = response.data;
            })
            .catch( error => {
                console.log(error);
            });
        },

        getProductVendors() {
            console.log('getProductVendors()');
            const request = this.productVendorsEndpoint;
            axios(request)
            .then(response => {
                this.productVendorValues = response.data;
            })
            .catch( error => {
                console.log(error);
            });
        },


        handleClickProduct(row) {
            console.log(row)        
        },

        handleDblClickProduct(row) {
            console.log('handleDblClickProduct', row);   
            eventBus.$emit("product-selected", row);     
            this.show = false;
        },

    },
}
</script>        