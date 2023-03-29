<template>
    <div class="home">
        <v-card max-width="1000px"  >

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >{{getTitle()}}</span>                        
                    <v-spacer></v-spacer>
                </v-row>
            </v-card-title>

            <p></p>
            <v-card-text>
                <v-row >
                    <v-col cols="2">
                        <v-text-field label="Order Date" type="date" v-model = "orderDate" dense></v-text-field>                        
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Customer Name" v-model="order.customerName" dense class="font-weight-bold"                                               
                        :readonly="true"
                        append-icon="mdi-account-search"  @click:append="handleClickFindCustomer"
                        clearable></v-text-field>                        
                    </v-col>
                    <v-col cols="1">
                        <v-btn  color="primary" @click="handleClickFindCustomer"><v-icon>mdi-account-search</v-icon>Find Customer</v-btn>                                    
                    </v-col>
                </v-row>

                <v-row >
                    <v-col cols="2">
                        <v-text-field label="Required Date" type="date" v-model="requiredDate" dense class="font-weight-bold"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-select v-model="order.status" :items="statusValues" label="Status" dense class="font-weight-bold"></v-select>                        
                    </v-col>
                </v-row>                
                <v-row>            
                    <v-col cols="2">
                        <v-text-field label="Shipped Date" type="date" v-model="shippedDate" dense clearable></v-text-field>
                    </v-col>
                    <v-col cols="8">
                        <v-textarea rows="1" auto-grow label="comments" v-model="order.comments" dense></v-textarea>
                    </v-col>
                </v-row>
                <p></p>
            </v-card-text>
            <v-card-actions>
                <v-btn color="secondary" @click="close" text>Cancel</v-btn>
                <v-btn color="primary" @click="handleClickSave" type="submit">Save</v-btn>
            </v-card-actions>

        </v-card>
        <p></p>
        <v-card flat max-width="1000px"  >

            <v-card-title class="grey darken-1 ">
                <v-row class="ma-0">
                    <span class="text-5 white--text" >Order Details</span>   
                    <v-spacer></v-spacer>
                    <v-btn dark icon @click="handleClickAddOrderDetail"><v-icon>mdi-plus-thick</v-icon></v-btn>                            
                    <v-btn dark icon @click="handleClickEditOrderDetail"><v-icon >mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickDeleteOrderDetail"><v-icon >mdi-delete</v-icon></v-btn>                

                </v-row>
            </v-card-title>

            <v-data-table :items="orderDetails" :headers="orderDetailHeaders" 
                item-key="productCode" 
                dense class="elevation-3" :items-per-page="15"                 
                :single-select="true"  show-select 
                v-model="selected"
                @dblclick:row="($event, {item})=>handleDblClickOrderDetail(item)">

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
            <AlertBox ref="theAlertBox" v-show="showAlert"/>
            
            <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout"  light centered multi-line>
                {{ snackbarText }}  
                <template v-slot:action="{ attrs }">
                    <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
                </template>
            </v-snackbar>

        </v-card>
        <CustomerSearchDialog ref="theCustomerSearchDialog" />
        <ProductSearchDialog ref="theProductSearchDialog" />
        <OrderDetailEditDialog ref="theOrderDetailEditDialog" />
        <OrderDetailDeleteDialog ref="theOrderDetailDeleteDialog" />
    </div>
  </template>


<script>
import axios from 'axios';
import router from '@/router';
import {eventBus} from "../../main";
import CustomerSearchDialog from '../EditViews/CustomerSearchDialog.vue';
import ProductSearchDialog from '../EditViews/ProductSearchDialog.vue';
import OrderDetailEditDialog from '../EditViews/OrderDetailEditDialog.vue';
import OrderDetailDeleteDialog from '../EditViews/OrderDetailDeleteDialog.vue';
import AlertBox from '../../components/AlertBox.vue';
import Order from '../../models/Order.js';
import OrderDetail from '@/models/OrderDetail';



export default {
    name: 'OrderView',
    props: ['orderNumber'],
    components: {
        AlertBox,
        CustomerSearchDialog,
        ProductSearchDialog,
        OrderDetailEditDialog,
        OrderDetailDeleteDialog,
    },
    data() {
      return {
        order: new Order(),
        orderDate: '',
        requiredDate: '',
        shippedDate: '',
        statusValues: [
            'In Process',
            'Shipped',
            'Resolved',
            'Cancelled',
            'On Hold',
            'Disputed',
            ],
        endpoint: 'http://localhost:8080/api/orders',   
        showAlert: false,   
        createTestData: false,
        orderDetails: [],
        selected: [],

        showSnackbar: false,
        snackbarText: '',
        snackbarTimeout: 2000,

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
        console.log('created');   
        this.orderDetails = []; 
        if (this.orderNumber === undefined) {
            this.orderDate = this.getDateNow();
            this.requiredDate = this.getDateIn7Days();
            this.shippedDate = '';
            this.order.status = 'In Process';
            if( this.createTestData ) {
                this.order.customerName = 'Baane Mini Imports';
                this.order.customerNumber = 121;
                const firstOrderDetail = new OrderDetail('S10_4698', 
                    '2003 Harley-Davidson Eagle Drag Bike', 123, 91.02 );                        
                this.orderDetails.push(firstOrderDetail);
            }
        } else {
            this.getOrder(this.orderNumber);
            this.getOrderDetails(this.orderNumber);
        }

        eventBus.$on("customer-selected", (data) => {
            this.order.customerName = data.customerName;   
            this.order.customerNumber = data.customerNumber;         
        });

        eventBus.$on("orderDetail-created", (data) => {
            const newOrderDetail = OrderDetail.from(data);
            this.orderDetails.push(newOrderDetail);
            this.renumberOrderDetails();
            if( this.orderDetails.length > 0 ) {
                const firstOrderDetail = this.orderDetails[0];
                this.selected = [firstOrderDetail];
            }
        });

        eventBus.$on("orderDetail-changed", (data) => {
            this.orderDetails.forEach((orderDetail) => {
                if( orderDetail.orderLineNumber === data.orderLineNumber) {
                    orderDetail.quantityOrdered = data.quantityOrdered;
                    orderDetail.priceEach = data.priceEach;
                }
            });
        });

        eventBus.$on("orderDetail-deleted", (data) => {
            const productCode = data.productCode;
            this.orderDetails = this.orderDetails.filter(od => od.productCode !== productCode);
        });

        eventBus.$on("product-selected", (data) => {
            const productCode = data.productCode;
            var orderDetailsWithProductCode = this.orderDetails.filter(od => od.productCode === productCode);
            if( orderDetailsWithProductCode.length > 0 ) {
                eventBus.$emit("product-already-selected", orderDetailsWithProductCode[0]);                
            }            
        });


        console.log('created');              
    },

    
    methods: {   

        getOrder(orderNumber) {
            axios(this.endpoint + '/' + orderNumber)
            .then(response => {
                this.order = response.data;              
                this.orderDate = this.formatDate(this.order.orderDate);
                this.requiredDate = this.formatDate(this.order.requiredDate);
                this.shippedDate = this.formatDate(this.order.shippedDate);
            })
            .catch( error => {
                console.log(error)
            })
        },

        getOrderDetails(orderNumber) {
            axios(this.endpoint + '/' + orderNumber + '/orderDetails')
            .then(response => {
                this.orderDetails = response.data;
                if( this.orderDetails.length > 0 ) {
                    const firstOrderDetail = this.orderDetails[0];
                    this.selected = [firstOrderDetail];
                }
            })
            .catch( error => {
                console.log(error)
            })
        },

        close: function () {            
            console.log('close');
            if (this.orderNumber === undefined) {
                router.push('/orders');
            } else {
                router.push({path: `/orders/${this.order.orderNumber}`});
            }
            this.show = false;
        }, 

        handleClickSave: function () { 
            console.log('handleClickSave');
            this.showSnackbar = false;
            if( !this.validateOrder() ) {
                this.showSnackbar = true;
            } else {                         
                if (this.orderNumber === undefined) {
                    this.saveNewAndClose();            
                } else {
                    this.saveEditAndClose();            
                }         
            }
        }, 

        validateOrder() {            
            this.snackbarText = '';
            if( this.order.customerNumber === 0 ) {
                this.snackbarText = 'Please select a customer';
                return false;
            }
            if( this.orderDetails.length === 0 ) {
                this.snackbarText = 'Please add an Order Detail';
                return false;
            }            
            const currentDate = new Date();

            var orderDate = new Date(Date.parse(this.orderDate));            
            if(orderDate > currentDate){
                this.snackbarText = 'Order Date can\'t be in the future';
                return false;
            }
            var requiredDate = new Date(Date.parse(this.requiredDate));            
            if(currentDate > requiredDate){
                this.snackbarText = 'Required Date can\'t be in the past';
                return false;
            }
            return true;
        },

        saveNewAndClose() {
            console.log('saveNewAndClose');
            this.renumberOrderDetails();
            const request = this.endpoint;
            const obj = {
                orderNumber: this.order.orderNumber,
                orderDate: this.getIsoDateFromString(this.orderDate),
                requiredDate: this.getIsoDateFromString(this.requiredDate),
                shippedDate: this.getIsoDateFromString(this.shippedDate),
                status: this.order.status,
                comments: this.order.comments,
                customerNumber: this.order.customerNumber,
                orderDetails: this.orderDetails,
            };
            console.log('request=' + request);
            console.log('obj=' + JSON.stringify(obj));
            (async () => {await axios.post(request, obj)
                .then(response => {
                    console.log('response', response);
                    this.showAlert = false;
                    this.order.orderNumber = response.data.orderNumber;
                    router.push({path: `/orders/${this.order.orderNumber}`});
                })
                .catch(error => {                
                    console.error('There was an error!', error);
                    this.showAlert = true;
                    this.$refs.theAlertBox.open( error.response.data.message, error.response.data.errors );
                })})();

        },

        saveEditAndClose() {
            console.log('saveEditAndClose');
            this.renumberOrderDetails();
            const request = this.endpoint + '/' + this.order.orderNumber;
            const obj = {
                orderNumber: this.order.orderNumber,
                orderDate: this.getIsoDateFromString(this.orderDate),
                requiredDate: this.getIsoDateFromString(this.requiredDate),
                shippedDate: this.getIsoDateFromString(this.shippedDate),
                status: this.order.status,
                comments: this.order.comments,
                customerNumber: this.order.customerNumber,
                orderDetails: this.orderDetails,
            };
            console.log('request=' + request);
            console.log('obj=' + JSON.stringify(obj));
            (async () => {await axios.put(request, obj)
                .then(response => {
                    console.log('response', response);
                    this.showAlert = false;
                    this.order.orderNumber = response.data.orderNumber;
                    router.push({path: `/orders/${this.order.orderNumber}`});
                })
                .catch(error => {                
                    console.error('There was an error!', error);
                    this.showAlert = true;
                    this.$refs.theAlertBox.open( error.response.data.message, error.response.data.errors );
                })})();
        },


        renumberOrderDetails() {
            let orderLineNumber = 0;
            this.orderDetails.forEach((orderDetail) => {
                orderDetail.orderNumber = this.order.orderNumber;
                orderDetail.orderLineNumber = orderLineNumber;
                orderLineNumber++;
            });
        },

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

        handleClickEditOrderDetail() {               
            const row = this.selected[0];          
            if( row === undefined ) {
                this.snackbarText = 'Please select an Order Detail';
                this.showSnackbar = true;
            } else {
                this.$refs.theOrderDetailEditDialog.open(row);      
            }
        },

        handleClickDeleteOrderDetail() {    
            const row = this.selected[0];          
            if( row === undefined ) {
                this.snackbarText = 'Please select an Order Detail';
                this.showSnackbar = true;
            } else {
                this.$refs.theOrderDetailDeleteDialog.open(row);    
            }
        },

        handleDblClickOrderDetail(row) {
            console.log('handleDblClickOrderDetail', row);   
            this.$refs.theOrderDetailEditDialog.open();   
        },

        getPriceEach(num) {
            return (Math.round(num * 100) / 100).toFixed(2);
        },

        getDateNow() {
           const now = new Date();
           return this.getDateAsString(now);
        },

        getDateIn7Days() {
            var days = 7;
            var date = new Date();
            date.setDate(date.getDate() + days);
            return this.getDateAsString(date);        
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

        getIsoDateFromString(theDate) {
            if( theDate === null || theDate === '') {
                return null;
            }
            const date = new Date(Date.parse(theDate));
            return date.toISOString();
        },

        formatDate(date) {
            if( date === null ) {
                return null;
            }
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;

            return [year, month, day].join('-');            
        },

        getTitle() {
        if (this.orderNumber === undefined) {
            return 'Order Entry';            
        } else {
            return `Edit Order ${this.orderNumber}`;
        }
      },


    },

}
</script>
