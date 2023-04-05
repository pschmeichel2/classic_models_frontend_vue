<template>
    <div class="home">
        <v-card max-width="1000px">
            <v-card-title class="justify-center"></v-card-title>

            <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text">Customer {{ $route.params.customerNumber }} ({{ customer.customerName
                    }})</span>
                    <v-spacer></v-spacer>
                    <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickEdit"><v-icon>mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickDelete"><v-icon>mdi-delete</v-icon></v-btn>
                </v-row>
            </v-card-title>
            <p></p>
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Customer Name" v-model="customer.customerName" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Customer Number" v-model="customer.customerNumber" dense
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Contact Last Name" v-model="customer.contactLastName" dense
                            class="font-weight-bold" :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Contact First Name" v-model="customer.contactFirstName" dense
                            class="font-weight-bold" :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Phone" v-model="customer.phone" dense :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="AddressLine 1" v-model="customer.addressLine1" dense
                            :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="AddressLine 2" v-model="customer.addressLine2" dense
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="City" v-model="customer.city" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Country" v-model="customer.country" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field label="State" v-model="customer.state" dense :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field label="Postal Code" v-model="customer.postalCode" dense
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="SalesRep" v-if="this.customer.salesRepEmployeeName === null"
                            v-model="getSalesRep" dense :readonly="true"></v-text-field>
                        <v-text-field label="SalesRep" v-else v-model="getSalesRep" dense prepend-icon="mdi-open-in-app"
                            @click:prepend="handleClickSalesRep" :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Credit Limit" v-model="customer.creditLimit" dense
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <p></p>

        <v-card max-width="1000px">
            <v-tabs>
                <v-tab>Balance</v-tab>
                <v-tab>Purchase Chart</v-tab>
                <v-tab>Purchases</v-tab>
                <v-tab>Orders</v-tab>
                <v-tab>Payments</v-tab>


                <v-tab-item :key="0">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text">Balance</span>
                            </v-row>
                        </v-card-title>

                        <v-data-table :items="balanceLines" :headers="balanceHeaders" item-key="id" dense
                            class="elevation-3" :items-per-page="15">

                            <template v-slot:item="i">
                                <tr>
                                    <td :class="'text-left'">{{ formatDate(i.item.transactionDate) }}</td>

                                    <td :class="{
                                        'text-left font-weight-regular green--text': i.item.status.trim() === 'Payment',
                                        'text-left font-italic font-weight-bold': i.item.status !== 'Payment' && i.item.status !== 'Shipped',
                                        'text-left font-weight-regular': i.item.status === 'Shipped',
                                    }">{{ i.item.status }}</td>

                                    <td :class="{
                                        'text-right red--text': i.item.amount < 0,
                                        'text-right green--text': i.item.amount > 0,
                                        'text-right font-weight-regular': i.item.amount === 0,
                                    }">{{ formatCurrency(i.item.amount) }}</td>

                                    <td :class="{
                                        'text-right red--text': i.item.balance < 0,
                                        'text-right green--text': i.item.balance >= 0,
                                    }">{{ formatCurrency(i.item.balance) }}</td>

                                </tr>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-tab-item>

                <v-tab-item :key="1">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text">Purchase Chart</span>
                            </v-row>
                        </v-card-title>
                        <div id="chart">
                            <apexchart type="treemap" height="500" :options="chartOptions" :series="series"></apexchart>
                        </div>
                    </v-card>
                </v-tab-item>

                <v-tab-item :key="2">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text">Purchases</span>
                            </v-row>
                        </v-card-title>

                        <v-data-table :items="purchases" :headers="purchaseHeaders" item-key="id" dense class="elevation-3"
                            :items-per-page="15">

                            <template v-slot:item.total="{ item }">
                                <span>{{ formatCurrency(item.total) }}</span>
                            </template>
                            <template v-slot:item.orderDate="{ item }">
                                <span>{{ formatDate(item.orderDate) }}</span>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-tab-item>


                <v-tab-item :key="3">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text">Orders</span>
                            </v-row>
                        </v-card-title>

                        <v-data-table :items="orders" :headers="orderHeaders" item-key="orderNumber" dense
                            class="elevation-3" :items-per-page="15" @click:row="handleClickOrder">
                            <template v-slot:item.orderDate="{ item }">
                                <span>{{ formatDate(item.orderDate) }}</span>
                            </template>
                            <template v-slot:item.requiredDate="{ item }">
                                <span>{{ formatDate(item.requiredDate) }}</span>
                            </template>
                            <template v-slot:item.shippedDate="{ item }">
                                <span>{{ formatDate(item.shippedDate) }}</span>
                            </template>
                            <template v-slot:item.status="{ item }">
                                <span class="font-weight-bold">{{ item.status }}</span>
                            </template>

                            <template v-slot:item.totalOrderPrice="{ item }">
                                <span>{{ formatCurrency(item.totalOrderPrice) }}</span>
                            </template>
                            <template v-slot:item.recommendedOrderPrice="{ item }">
                                <span>{{ formatCurrency(item.recommendedOrderPrice) }}</span>
                            </template>
                            <template v-slot:item.buyPrice="{ item }">
                                <span>{{ formatCurrency(item.buyPrice) }}</span>
                            </template>
                            <template v-slot:item.discountPercent="{ item }">
                                <span>{{ getDiscountPercent(item) }}</span>
                            </template>
                            <template v-slot:item.profitPercent="{ item }">
                                <span>{{ getProfitPercent(item) }}</span>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-tab-item>

                <v-tab-item :key="4">
                    <v-card flat>
                        <v-card-title class="grey darken-1 ">
                            <v-row class="ma-0">
                                <span class="text-5 white--text">Payments</span>
                            </v-row>
                        </v-card-title>

                        <v-data-table :items="payments" :headers="paymentHeaders" item-key="orderNumber" dense
                            class="elevation-3" :items-per-page="15" @click:row="handleClickPayment">

                            <template v-slot:item.checkNumber="{ item }">
                                <span class="font-weight-bold">{{ item.checkNumber }}</span>
                            </template>
                            <template v-slot:item.paymentDate="{ item }">
                                <span>{{ formatDate(item.paymentDate) }}</span>
                            </template>
                            <template v-slot:item.amount="{ item }">
                                <span>{{ formatCurrency(item.amount) }}</span>
                            </template>

                        </v-data-table>
                    </v-card>
                </v-tab-item>



            </v-tabs>

            <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" light centered multi-line>
                {{ snackbarText }}
                <template v-slot:action="{ attrs }">
                    <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
                </template>
            </v-snackbar>

        </v-card>
    </div>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';
import Customer from '@/models/Customer';
import VueApexCharts from 'vue-apexcharts';

export default {
    name: 'CustomerView',
    props: ['customerNumber'],
    components: {
        apexchart: VueApexCharts,
    },

    data() {
        return {
            customer: new Customer(),
            endpoint: 'http://localhost:8080/api/customers/',
            orders: [],
            payments: [],
            balanceLines: [],
            purchases: [],
            purchaseAggregates: [],

            showSnackbar: false,
            snackbarText: '',
            snackbarTimeout: 2000,

            orderHeaders: [
                { text: "Order Number", value: "orderNumber", width: '5px', class: "blue lighten-5" },
                { text: "Order Date", value: "orderDate", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Required Date", value: "requiredDate", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Shipped Date", value: "shippedDate", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Status", value: "status", width: '5px', class: "blue lighten-5" },
                //{text: "Customer Number", value: "customerNumber", width: '5px',  class:"blue lighten-5"},
                { text: "Order Total", value: "totalOrderPrice", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Recommended Price", value: "recommendedOrderPrice", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Purchasing Price", value: "buyPrice", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Discount %", value: "discountPercent", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Profit %", value: "profitPercent", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Comments", value: "comments", width: '500px', class: "blue lighten-5" },
            ],

            paymentHeaders: [
                //{text: "Customer Number", value: "customerNumber", width: '5px',  class:"blue lighten-5"},
                { text: "Check Number", value: "checkNumber", width: '5px', class: "blue lighten-5" },
                { text: "Payment Date", value: "paymentDate", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Amount", value: "amount", width: '5px', align: 'right', class: "blue lighten-5" },
            ],

            balanceHeaders: [
                { text: "Transaction Date", value: "transactionDate", width: '5px', class: "blue lighten-5" },
                { text: "Status/Type", value: "status", width: '5px', class: "blue lighten-5" },
                { text: "Amount", value: "amount", width: '5px', align: 'right', class: "blue lighten-5" },
                { text: "Balance", value: "balance", width: '5px', align: 'right', class: "blue lighten-5" },
            ],

            purchaseHeaders: [
                //{ text: "Order/ProductCode", value: "id", width: '50px', class: "blue lighten-5" },
                { text: "Order Date", value: "orderDate", width: '50px', class: "blue lighten-5" },
                { text: "Product Line", value: "productLine", width: '100px', class: "blue lighten-5" },
                { text: "Prooduct Code", value: "productCode", width: '50px', class: "blue lighten-5" },
                { text: "Product Name", value: "productName", width: '250px', class: "blue lighten-5" },
                { text: "Price", value: "total", width: '50px', align: 'right', class: "blue lighten-5" },                
            ],


            series: [],


            chartOptions: {
                legend: {
                    show: true
                },
                chart: {
                    height: 750,
                    type: 'treemap'
                },
                title: {
                    text: 'Purchases (Amount)',
                    align: 'center'
                }
            },


        }
},

watch: {
    '$route'() {
        this.getCustomer(this.customerNumber);
        this.getOrders(this.customerNumber);
        this.getPayments(this.customerNumber);
        this.getCustomerBalanceLines(this.customerNumber);
        this.getPurchases(this.customerNumber);
    }
},

created() {
    this.showSnackbar = false;
    this.snackbarText = '';
    this.getCustomer(this.customerNumber);
    this.getOrders(this.customerNumber);
    this.getPayments(this.customerNumber);
    this.getCustomerBalanceLines(this.customerNumber);
    this.getPurchases(this.customerNumber);
    this.getPurchaseAggregates(this.customerNumber);
},

computed: {

    getSalesRep() {
        if (this.customer.salesRepEmployeeName === null) {
            return "n/a";
        }
        return `${this.customer.salesRepEmployeeName} (${this.customer.salesRepEmployeeNumber})`;
    },

},

methods: {

    getCustomer(customerNumber) {
        axios(this.endpoint + customerNumber)
            .then(response => {
                this.customer = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    getOrders(customerNumber) {
        axios(this.endpoint + customerNumber + '/ordertotals')
            .then(response => {
                this.orders = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    getPayments(customerNumber) {
        axios(this.endpoint + customerNumber + '/payments')
            .then(response => {
                this.payments = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    getCustomerBalanceLines(customerNumber) {
        axios(this.endpoint + customerNumber + '/balance')
            .then(response => {
                this.balanceLines = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    getPurchases(customerNumber) {
        axios(this.endpoint + customerNumber + '/purchases')
            .then(response => {
                this.purchases = response.data;
            })
            .catch(error => {
                console.log(error);
            });
    },

    getPurchaseAggregates(customerNumber) {
        axios(this.endpoint + customerNumber + '/purchaseAggregates')
            .then(response => {
                this.purchaseAggregates = response.data;
                //this.series = this.getPurchasesForTreemap();
                this.getPurchasesForTreemap();
            })
            .catch(error => {
                console.log(error);
            });
    },


    getPurchasesForTreemap() {
        var productLines = [];
        var series = [];
        var productLine = {name:'', data:[]};
        for( const purchase of this.purchaseAggregates ) {
            if( productLines.indexOf(purchase.productLine) === -1 ) {
                productLines.push(purchase.productLine);
                productLine = {name: purchase.productLine, data: []};
                series.push(productLine);                
            }
            productLine.data.push({x:purchase.productName, y:purchase.total});
        }        
        console.log(series);
        this.series = series;
    },

    handleClickOrder(row) {
        console.log(row);
        router.push({ path: `/orders/${row.orderNumber}` });
    },

    handleClickPayment(row) {
        console.log(row);
        router.push({ path: `/payments/${row.customerNumber}/${row.checkNumber}` });
    },

    handleClickSalesRep() {
        router.push({ path: `/employees/${this.customer.salesRepEmployeeNumber}` });
    },

    handleClickAdd() {
        console.log('handleClickAdd');
        this.showSnackbar = true;
        this.snackbarText = 'not implemented';
    },

    handleClickEdit() {
        console.log('handleClickEdit');
        this.showSnackbar = true;
        this.snackbarText = 'not implemented';
    },

    handleClickDelete() {
        console.log('handleClickDelete');
        this.showSnackbar = true;
        this.snackbarText = 'not implemented';
    },

    formatCurrency(value) {
        return (value).toFixed(2);
    },

    getDiscountPercent(item) {
        const discount = item.recommendedOrderPrice - item.totalOrderPrice;
        const discountPercent = discount / item.recommendedOrderPrice * 100;
        return this.formatCurrency(discountPercent);
    },

    getProfitPercent(item) {
        const profit = item.totalOrderPrice - item.buyPrice;
        const profitPercent = profit / item.buyPrice * 100;
        return this.formatCurrency(profitPercent);
    },


    formatDate(date) {
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
  