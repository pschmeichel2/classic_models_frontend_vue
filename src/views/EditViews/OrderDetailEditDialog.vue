<template>
    <v-dialog persistent v-model="show" max-width="1000px" height="400px"
    ref="Dialog" @keydown.esc="show = false">
        <v-card>

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Add Order Detail</span>                        
                    <v-spacer></v-spacer>
                </v-row>                
            </v-card-title>

            <p></p>

            <v-card-text>
                <v-row >
                    <v-col cols="2">
                        <v-text-field label="Product Code" dense
                        v-model="orderDetail.productCode" />
                    </v-col>
                    <v-col cols="1">
                        <v-btn  color="primary" @click="handleClickFindProduct"><v-icon>mdi-car-search</v-icon>Find Product</v-btn>                                    
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="6">
                        <v-text-field label="Product Name" dense 
                        v-model="orderDetail.productName"/>
                    </v-col>
                </v-row>
                <v-row >
                    <v-col cols="3">
                        <v-text-field label="Quantity ordered" dense  reverse
                        v-model="orderDetail.quantityOrdered"
                        required maxlength="10"  :rules="[rules.isInteger]" />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="Price each" dense  reverse
                        v-model="orderDetail.priceEach"
                        required maxlength="10"  :rules="[rules.isCurrency]"/>
                    </v-col>
                </v-row>
            </v-card-text>
            <p></p>
            <v-card-actions>
                <v-btn color="secondary" @click="close" text>Cancel</v-btn>
                <v-btn color="primary" @click="submit"  type="submit">Ok</v-btn>
            </v-card-actions>

        </v-card>
        <ProductSearchDialog ref="theProductSearchDialog" />
    </v-dialog>

</template>

<script>
import axios from 'axios';
import { eventBus } from "../../main";
import ProductSearchDialog from '../EditViews/ProductSearchDialog.vue';
import OrderDetail from '../../models/OrderDetail.js';

export default {
    name: 'OrderDetailEditDialog',
    components: {
        ProductSearchDialog,
    },
    data() {
        return {      
            endpoint: 'http://localhost:8080/api/customers',
            show: false,
            orderDetail: new OrderDetail(),

            rules: {
                required: value => !!value || 'Required.',
                isNumeric: value => !isNaN(value) || 'Must be numeric',
                isInteger: value => (!Number.isNaN(Number.parseFloat(value))
                    && Number.parseInt(value, 10) > 0) 
                    || 'Must be integer > 0',
                isCurrency: value => (!Number.isNaN(Number.parseFloat(value))
                    && Number.parseFloat(value) > 0) 
                    || 'Must be currency > 0',
            },

        }
    },

    created() {
        eventBus.$on("product-selected", (data) => {
            this.orderDetail.productCode = data.productCode;   
            this.orderDetail.productName = data.productName;  
        });
    },

    methods: {

        open: function () {
            this.show = true;
            this.orderDetail.productCode = '';   
            this.orderDetail.productName = '';  
            this.orderDetail.quantityOrdered = 1;   
            this.orderDetail.priceEach = 0.0;  
            console.log('open');
        },

        close: function () {            
            this.show = false;
        }, 

        submit: function () {            
            this.show = false;
        }, 

        handleClickFindProduct() {                        
            this.$refs.theProductSearchDialog.open();      
        },


    },
}
</script>        