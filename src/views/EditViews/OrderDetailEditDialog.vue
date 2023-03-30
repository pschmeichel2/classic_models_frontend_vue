<template>
    <v-dialog persistent v-model="show" max-width="1000px" height="400px"
    ref="Dialog" @keydown.esc="show = false">
        <v-card>

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >{{getTitle}}</span>                        
                    <v-spacer></v-spacer>
                </v-row>                
            </v-card-title>

            <p></p>

            <v-card-text>
                <v-row >
                    <v-col cols="2">
                        <v-text-field label="Product Code" dense :readonly="true"
                        v-model="orderDetail.productCode" ref="productCodeRef"
                        append-icon="mdi-car-search"  @click:append="handleClickFindProduct"
                        :disabled=isChangeMode />
                    </v-col>
                    <v-col cols="1">
                        <v-btn  color="primary" @click="handleClickFindProduct"
                        :disabled=isChangeMode >
                        <v-icon>mdi-car-search</v-icon>Find Product</v-btn>                                    
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="6">
                        <v-text-field label="Product Name" dense :readonly="true"
                        v-model="orderDetail.productName" class="font-weight-bold"
                        append-icon="mdi-car-search"  @click:append="handleClickFindProduct"
                        :disabled=isChangeMode />
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="3">
                        <v-text-field label="Quantity ordered" dense  reverse
                        v-model="orderDetail.quantityOrdered"
                        required maxlength="10"  :rules="[rules.isInteger]"                         
                        ref="quantityOrderedRef"
                        type="number"/>
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="Price each" dense  reverse
                        v-model="orderDetail.priceEach"
                        required maxlength="10"  :rules="[rules.isCurrency]"
                        type="number"/>
                    </v-col>
                </v-row>
            </v-card-text>
            <p></p>
            <v-card-actions>
                <v-btn color="secondary" @click="close" text>Cancel</v-btn>
                <v-btn color="primary" @click="submit" type="submit">Ok</v-btn>
            </v-card-actions>

            <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" light centered multi-line>
                {{ snackbarText }}  
                <template v-slot:action="{ attrs }">
                    <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
                </template>
            </v-snackbar>


        </v-card>
        <ProductSearchDialog ref="theProductSearchDialog" />
    </v-dialog>

</template>

<script>
import axios from 'axios';
import { eventBus } from "../../main";
import ProductSearchDialog from '../EditViews/ProductSearchDialog.vue';
import OrderDetail from '../../models/OrderDetail.js';
import { tsImportEqualsDeclaration } from '@babel/types';
import Product from '@/models/Product';

export default {
    name: 'OrderDetailEditDialog',
    components: {
        ProductSearchDialog,
    },
    data() {
        return {      
            endpoint: 'http://localhost:8080/api/customers',
            productsEndpoint: 'http://localhost:8080/api/products',
            show: false,
            orderDetail: new OrderDetail(),
            product: new Product(),
            orderLineNumber: undefined,

            showSnackbar: false,
            snackbarText: '',
            snackbarTimeout: 2000,

            rules: {
                required: value => !!value || 'Required.',
                isNumeric: value => !isNaN(value) || 'Must be numeric',
                isInteger: value => (!Number.isNaN(Number.parseFloat(value))
                    && Number.parseInt(value, 10) > 0
                    && this.isNumeric(value)) 
                    || 'Must be whole number > 0',
                isCurrency: value => (!Number.isNaN(Number.parseFloat(value))
                    && Number.parseFloat(value) > 0) 
                    || 'Must be currency > 0',
            },

        }
    },

    created() {
        this.showSnackbar = false;

        eventBus.$on("product-selected", (data) => {
            this.showSnackbar = false;
            this.orderDetail.productCode = data.productCode;   
            this.orderDetail.productName = data.productName;   
            this.getProduct(data.productCode);           
            setTimeout(() => {
              this.$refs.quantityOrderedRef.$refs.input.select();
            });
        });

        eventBus.$on("product-already-selected", (data) => {
            console.log('product-already-selected');
            this.orderDetail.priceEach = data.priceEach;
            this.orderDetail.quantityOrdered = data.quantityOrdered;
            this.orderDetail.orderLineNumber = data.orderLineNumber;
            this.orderLineNumber = data.orderLineNumber;
            // TODO snackbar isn't displayed
            this.snackbarText = 'Product '+ data.productName + ' is already contained in Order Detail list';
            this.showSnackbar = true;
        });
    },

    computed: {

        getTitle() {
            if( this.orderLineNumber === undefined || this.orderLineNumber === null ) {
                return "Add Order Detail";
            } else {
                return "Edit Order Detail";
            }
        },

        isChangeMode() {
            return !(this.orderLineNumber === null);
        },

    }, 

    methods: {

        open: function (orderDetail) {
            console.log('open');
            this.showSnackbar = false;
            this.show = true;
            this.product = new Product();
            if( orderDetail === undefined ) {
                this.orderLineNumber = null;
                this.orderDetail = new OrderDetail();
                this.orderDetail.productCode = '';   
                this.orderDetail.productName = '';  
                this.orderDetail.quantityOrdered = 1;   
                this.orderDetail.priceEach = 0.0;  
            } else {
                this.orderLineNumber = orderDetail.orderLineNumber;                
                this.orderDetail = OrderDetail.from(orderDetail);                                                
                console.log('edit');
            }
            setTimeout(() => {
              this.$refs.quantityOrderedRef.$refs.input.select();
            });
        },

        close: function () {            
            this.show = false;
        }, 

        submit: function () { 
            console.log('submit');  
            this.showSnackbar = false;
            if( !this.validateOrderDetail() ) {
                this.showSnackbar = true;                
            } else {                      
                this.orderDetail.quantityOrdered =  Number.parseInt(this.orderDetail.quantityOrdered, 10);            
                this.orderDetail.priceEach =  Number.parseFloat(this.orderDetail.priceEach);            
                if( this.orderLineNumber === null ) {
                    eventBus.$emit("orderDetail-created", this.orderDetail);                
                } else {
                    eventBus.$emit("orderDetail-changed", this.orderDetail);                
                }
                this.show = false;
            }
        }, 

        validateOrderDetail() {
            this.snackbarText = '';
            if( this.orderDetail.productCode === '') {
                this.snackbarText = 'Please select a product';
                return false;
            }
            if( isNaN(this.orderDetail.quantityOrdered)) {
                this.snackbarText = 'Quantity ordered must be numeric';
                return false;
            }
            if( Number.parseInt(this.orderDetail.quantityOrdered, 10) <= 0 ||
                !this.isNumeric(this.orderDetail.quantityOrdered)) {
                this.snackbarText = 'Quantity ordered must be whole number > 0';
                return false;
            }
            if( isNaN(this.orderDetail.priceEach)) {
                this.snackbarText = 'Price must be numeric';
                return false;
            }
            if( Number.parseFloat(this.orderDetail.priceEach) <= 0 ) {
                this.snackbarText = 'Price must be currency > 0';
                return false;
            }
            return true;
        },

        isNumeric(value) {
          return /^-?\d+$/.test(value);
        },

        onlyNumbers: function() {
            console.log('onlyNumbers', this.orderDetail.quantityOrdered);  
            this.orderDetail.quantityOrdered = this.orderDetail.quantityOrdered.replace(/[^0-9.]/g,'');
        },

        handleClickFindProduct() {                        
            this.$refs.theProductSearchDialog.open();      
        },

        getProduct(productCode) {
            console.log('getProduct', productCode);  
            axios(this.productsEndpoint + '/' + productCode)
            .then(response => {
                this.product = response.data;
                console.log('MSRP=', this.product.msrp);  
                this.orderDetail.priceEach = this.formatCurrency(this.product.msrp);
            })
            .catch( error => {
                console.log(error)
            })
        },

        formatCurrency (value) {
            return (value).toFixed(2);
        },


    },
}
</script>        