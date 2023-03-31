<template>
    <div class="home">
        <v-card max-width="1000px">

            <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text">Order {{ $route.params.orderNumber }}</span>
                    <v-spacer></v-spacer>
                    <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickEdit"><v-icon>mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickDelete"><v-icon>mdi-delete</v-icon></v-btn>
                </v-row>
            </v-card-title>

            <p></p>
            <v-card-text>
                <v-row>
                    <v-col cols="2">
                        <v-text-field label="Order Date" v-model="getOrderDate" dense :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Customer Name" v-model="getCustomerName" dense class="font-weight-bold"
                            prepend-icon="mdi-open-in-app" @click:prepend="handleClickCustomer"
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="2">
                        <v-text-field label="Required Date" v-model="getRequiredDate" dense :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Status" v-model="order.status" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="2">
                        <v-text-field label="Shipped Date" v-model="getShippedDate" dense :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="8">
                        <v-textarea rows="1" auto-grow label="comments" v-model="order.comments" dense
                            :readonly="true"></v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <p></p>

        <v-card flat max-width="1000px">

            <v-card-title class="grey darken-1 ">
                <v-row class="ma-0">
                    <span class="text-5 white--text">Order Details</span>
                </v-row>
            </v-card-title>

            <v-data-table :items="orderDetails" :headers="orderDetailHeaders" item-key="productCode" dense
                class="elevation-3" :items-per-page="15" @click:row="handleClickOrderDetail">

                <template v-slot:item.productCode="{ item }">
                    <span class="font-weight-bold">{{ item.productCode }}</span>
                </template>
                <template v-slot:item.productName="{ item }">
                    <span class="font-weight-bold">{{ item.productName }}</span>
                </template>
                <template v-slot:item.priceEach="{ item }">
                    <span>{{ getPriceEach(item.priceEach) }}</span>
                </template>

            </v-data-table>
            <OrderDeleteDialog ref="theOrderDeleteDialog" />
        </v-card>

    </div>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';
import Order from '@/models/Order';
import OrderDeleteDialog from '../EditViews/OrderDeleteDialog.vue';

export default {
    name: 'OrderView',
    props: ['orderNumber'],
    components: {
        OrderDeleteDialog,
    },
    data() {
        return {
            order: new Order(),
            endpoint: 'http://localhost:8080/api/orders/',
            orderDetails: [],
            //sortBy: 'orderLineNumber',
            orderDetailHeaders: [
                { text: "Order LineNumber", value: "orderLineNumber", width: '10px', class: "blue lighten-5" },
                { text: "Product Code", value: "productCode", width: '40px', class: "blue lighten-5" },
                { text: "Product Name", value: "productName", width: '200px', class: "blue lighten-5" },
                { text: "Quantity Ordered", value: "quantityOrdered", width: '20px', align: 'right', class: "blue lighten-5" },
                { text: "Price Each", value: "priceEach", width: '20px', align: 'right', class: "blue lighten-5" },
            ],

        }
    },

    watch: {
        '$route'() {
            this.getOrder(this.orderNumber);
            this.getOrderDetails(this.orderNumber);
        }
    },

    created() {
        this.getOrder(this.orderNumber);
        this.getOrderDetails(this.orderNumber);
    },

    computed: {

        getCustomerName() {
            if (this.order === null) {
                return '';
            }
            return `${this.order.customerName} (${this.order.customerNumber})`;
        },

        getOrderDate() {
            if (this.order === null) {
                return '';
            }
            return this.formatDate(this.order.orderDate);
        },

        getRequiredDate() {
            if (this.order === null) {
                return '';
            }
            return this.formatDate(this.order.requiredDate);
        },

        getShippedDate() {
            if (this.order === null) {
                return '';
            }
            return this.formatDate(this.order.shippedDate);
        },

    },

    methods: {

        getOrder(orderNumber) {
            axios(this.endpoint + orderNumber)
                .then(response => {
                    this.order = response.data
                })
                .catch(error => {
                    console.log(error)
                })
        },

        getOrderDetails(orderNumber) {
            axios(this.endpoint + orderNumber + '/orderDetails')
                .then(response => {
                    this.orderDetails = response.data
                })
                .catch(error => {
                    console.log(error)
                })
        },

        getPriceEach(num) {
            return (Math.round(num * 100) / 100).toFixed(2);
        },

        handleClickOrderDetail(row) {
            console.log(row)
            router.push({ path: `/orderDetails/${row.orderNumber}/${row.productCode}` })
        },

        handleClickCustomer() {
            router.push({ path: `/customers/${this.order.customerNumber}` });
        },

        handleClickAdd() {
            router.push({ path: '/orders/new' });
        },

        handleClickEdit() {
            console.log({ path: `/orders/${this.orderNumber}/edit` });
            router.push({ path: `/orders/${this.orderNumber}/edit` });
        },

        handleClickDelete() {
            this.$refs.theOrderDeleteDialog.open(this.orderNumber);
        },

        formatDate(date) {
            if (date === null) {
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

            return [day, month, year].join('.');
        },


    },


}
</script>
  