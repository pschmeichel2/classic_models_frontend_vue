<template>
    <div class="home">
        <v-card max-width="1000px">

            <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" id="header">Employee {{ $route.params.employeeNumber }} ({{
                        employee.firstName }}
                        {{ employee.lastName }})</span>
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
                        <v-text-field label="Last Name" v-model="employee.lastName" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="First Name" v-model="employee.firstName" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Job Title" v-model="employee.jobTitle" dense class="font-weight-bold"
                            :readonly="true"></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Office" id="office" v-model="getOffice" dense :readonly="true">
                            <template slot="prepend">
                                <v-icon @click="handleClickOffice" id="officelink">mdi-open-in-app</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Manager" v-if="this.employee.reportsTo === null" v-model="getReportsTo" dense
                            :readonly="true">
                        </v-text-field>
                        <v-text-field label="Manager" v-else v-model="getReportsTo" dense prepend-icon="mdi-open-in-app"
                            @click:prepend="handleClickReportsTo" :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Employee Number" v-model="employee.employeeNumber" dense :readonly="true">
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Extension" v-model="employee.extension" dense :readonly="true"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Email" v-model="employee.email" dense :readonly="true"></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                </v-row>

            </v-card-text>
        </v-card>
        <p></p>

        <v-tabs v-model="selectedTab">
            <v-tab id="1" name="customerTab">Customers</v-tab>
            <v-tab id="2" name="subordinatesTab">Subordinates</v-tab>

            <v-tab-item :key="0">
                <v-card flat>
                    <v-card-title class="grey darken-1 ">
                        <v-row class="ma-0">
                            <span class="text-5 white--text" id="subheader">Customers</span>
                        </v-row>
                    </v-card-title>

                    <v-data-table :items="customers" :headers="customersHeaders" item-key="customerNumber" dense
                        class="elevation-3" :items-per-page="15" @click:row="handleClickCustomer">

                        <template v-slot:item.customerName="{ item }">
                            <span class="font-weight-bold">{{ item.customerName }}</span>
                        </template>
                        <template v-slot:item.country="{ item }">
                            <span class="font-weight-bold">{{ item.country }}</span>
                        </template>

                    </v-data-table>
                </v-card>
            </v-tab-item>

            <v-tab-item :key="1">
                <v-card flat max-width="1000px">
                    <v-card-title class="grey darken-1 ">
                        <v-row class="ma-0">
                            <span class="text-5 white--text">Subordinates</span>
                        </v-row>
                    </v-card-title>

                    <v-data-table :items="employees" :headers="employeeHeaders" item-key="employeeNumber" dense
                        class="elevation-3" :items-per-page="15" @click:row="handleClickEmployee">

                        <template v-slot:item.lastName="{ item }">
                            <span class="font-weight-bold">{{ item.lastName }}</span>
                        </template>
                        <template v-slot:item.firstName="{ item }">
                            <span class="font-weight-bold">{{ item.firstName }}</span>
                        </template>

                    </v-data-table>
                    
                </v-card>
            </v-tab-item>
        </v-tabs>
        <EmployeeDeleteDialog ref="theEmployeeDeleteDialog" />
        <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" light centered multi-line>
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
        
    </div>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';
import Employee from '@/models/Employee';
import EmployeeDeleteDialog from '../EditViews/EmployeeDeleteDialog.vue';

export default {
    name: 'EmployeeView',
    props: ['employeeNumber'],
    components: {
        EmployeeDeleteDialog,
    },
    data() {
        return {
            employee: new Employee(),
            endpoint: process.env.VUE_APP_BASE_URL + '/employees/',
            selectedTab: null,
            customers: [],

            showSnackbar: false,
            snackbarText: '',
            snackbarTimeout: 2000,

            customersHeaders: [
                { text: "Customer Number", value: "customerNumber", width: '50px', class: "blue lighten-5" },
                { text: "Customer Name", value: "customerName", width: '150px', class: "blue lighten-5" },
                { text: "Contact Last Name", value: "contactLastName", width: '5px', class: "blue lighten-5" },
                { text: "Contact First Name", value: "contactFirstName", width: '5px', class: "blue lighten-5" },
                { text: "Phone", value: "phone", width: '150px', class: "blue lighten-5" },
                { text: "Address Line1", value: "addressLine1", width: '150px', class: "blue lighten-5" },
                { text: "Address Line2", value: "addressLine2", width: '5px', class: "blue lighten-5" },
                { text: "City", value: "city", width: '5px', class: "blue lighten-5" },
                { text: "State", value: "state", width: '5px', class: "blue lighten-5" },
                { text: "Postal Code", value: "postalCode", width: '5px', class: "blue lighten-5" },
                { text: "Country", value: "country", width: '5px', class: "blue lighten-5" },
                //{text: "salesRep EmployeeNumber", value: "salesRepEmployeeNumber", width: '5px',  class:"blue lighten-5"},
                { text: "Credit Limit", value: "creditLimit", width: '5px', align: 'right', class: "blue lighten-5" },
            ],

            employees: [],
            routeToEmployee: null,
            employeeHeaders: [
                { text: "Employee Number", value: "employeeNumber", width: '5px', class: "blue lighten-5" },
                { text: "Last Name", value: "lastName", width: '50px', class: "blue lighten-5" },
                { text: "First Name", value: "firstName", width: '50px', class: "blue lighten-5" },
                { text: "Job Title", value: "jobTitle", width: '150px', class: "blue lighten-5" },
                { text: "Extension", value: "extension", width: '50px', class: "blue lighten-5" },
                { text: "Email", value: "email", width: '50px', class: "blue lighten-5" },
                //{text: "reportsTo", value: "reportsToName", width: '50px',  class:"blue lighten-5"},
                { text: "City", value: "city", width: '50px', class: "blue lighten-5" },
            ],

        }
    },

    watch: {
        '$route'() {
            console.log('watch');
            this.customers = [];
            this.employees = [];            
            this.getEmployee(this.employeeNumber);
            this.getCustomers(this.employeeNumber);
            this.getEmployees(this.employeeNumber);
            this.isManager = false;
        }
    },

    created() {
        console.log('created');
        this.showSnackbar = false;
        this.snackbarText = '';
        this.customers = [];
        this.employees = [];
        this.getEmployee(this.employeeNumber);
        this.getCustomers(this.employeeNumber);
        this.getEmployees(this.employeeNumber);
    },

    computed: {

        getOffice() {
            return `${this.employee.city} (${this.employee.officeCode})`;
        },

        getReportsTo() {
            if (this.employee.reportsTo === null) {
                return "n/a";
            }
            return `${this.employee.reportsToName} (${this.employee.reportsTo})`;
        },

    },

    methods: {

        getEmployee(employeeNumber) {
            axios(this.endpoint + employeeNumber)
                .then(response => {
                    this.employee = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },

        getCustomers(employeeNumber) {
            this.customers = [];
            axios(this.endpoint + employeeNumber + '/customers')
                .then(response => {
                    this.customers = response.data;
                    if (this.customers === '') {
                        this.customers = [];
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.customers = [];
                })
        },

        getEmployees(employeeNumber) {
            this.employees = [];
            axios(this.endpoint + employeeNumber + '/employees')
                .then(response => {
                    this.employees = response.data;
                    if (this.employees === '') {
                        this.employees = [];
                    }
                    this.isManager = (this.employees.length > 0);
                    this.selectedTab = (this.isManager ? 1: 0);        
                })
                .catch(error => {
                    console.log(error);
                    this.employees = [];
                });
        },

        handleClickOffice() {
            router.push({ path: `/offices/${this.employee.officeCode}` });
        },

        handleClickReportsTo() {
            router.push({ path: `/employees/${this.employee.reportsTo}` });
        },

        handleClickEmployee(row) {
            console.log(row);
            this.routeToEmployee = row.employeeNumber;
            router.push({ path: `/employees/${this.routeToEmployee}` });
        },

        handleClickCustomer(row) {
            console.log(row);
            router.push({ path: `/customers/${row.customerNumber}` });
        },

        handleClickAdd() {
            console.log('handleClickAdd');
            router.push({ path: '/employees/new' });
        },

        handleClickEdit() {
            console.log('handleClickEdit');
            console.log({ path: `/employees/${this.employee.employeeNumber}/edit` });
            router.push({ path: `/employees/${this.employee.employeeNumber}/edit` });
        },

        handleClickDelete() {
            console.log('handleClickDelete');
            this.$refs.theEmployeeDeleteDialog.open(this.employeeNumber);
        },

    },

}
</script>
  