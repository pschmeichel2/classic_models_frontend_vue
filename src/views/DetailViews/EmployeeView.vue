<template>
    <div class="home">
        <v-card max-width="1000px"  >

            <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Employee {{ $route.params.employeeNumber }} ({{ employee.firstName }}  {{ employee.lastName }})</span>                        
                    <v-spacer></v-spacer>
                    <v-btn dark icon  @click="handleClickAdd"><v-icon >mdi-plus-thick</v-icon></v-btn>
                    <v-btn dark icon  @click="handleClickEdit"><v-icon >mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon><v-icon >mdi-delete</v-icon></v-btn>                
                </v-row>
            </v-card-title>
            <p></p>
        <!--<v-banner color="primary" class="title">Employee {{ $route.params.employeeNumber }} ({{ employee.firstName }} {{ employee.lastName }})</v-banner>
        -->
        <v-card-text>
            <v-row >                
                <v-col cols="4">
                    <v-text-field label="lastName" v-model="employee.lastName" dense class="font-weight-bold"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="firstName" v-model="employee.firstName" dense class="font-weight-bold"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="jobTitle" v-model="employee.jobTitle" dense class="font-weight-bold"></v-text-field>
                </v-col>

            </v-row>

            <v-row >
                <v-col cols="4">
                    <v-text-field label="officeCode" v-model="getOffice" dense
                    prepend-icon="mdi-open-in-app"  @click:prepend="handleClickOffice"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="reportsTo" v-if="this.employee.reportsTo === null" v-model="getReportsTo" dense>
                    </v-text-field>
                    <v-text-field label="reportsTo" v-else v-model="getReportsTo" dense
                    prepend-icon="mdi-open-in-app"  @click:prepend="handleClickReportsTo"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="employeeNumber" v-model="employee.employeeNumber" dense></v-text-field>
                </v-col>

            </v-row>

            <v-row >
                <v-col cols="4">
                    <v-text-field label="extension" v-model="employee.extension" dense></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="email" v-model="employee.email" dense></v-text-field>
                </v-col>
            </v-row>

            <v-row >
            </v-row>

            </v-card-text>
        </v-card>
        <p></p>

        <v-tabs v-model="selectedTab">
            <v-tab >Customers</v-tab>  
            <v-tab >Subordinates</v-tab>  

            <v-tab-item :key="0">
                <v-card flat>
                    <v-card-title class="grey darken-1 ">
                        <v-row class="ma-0">
                        <span class="text-5 white--text" >Customers</span>                        
                        </v-row>
                    </v-card-title>

                    <v-data-table :items="customers" :headers="customersHeaders" item-key="customerNumber" dense class="elevation-3"
                        :items-per-page="15" @click:row="handleClickCustomer">

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
                <v-card flat max-width="1000px" >
                    <v-card-title class="grey darken-1 ">
                        <v-row class="ma-0">
                        <span class="text-5 white--text" >Subordinates</span>                        
                        </v-row>
                    </v-card-title>

                    <v-data-table :items="employees" :headers="employeeHeaders" item-key="employeeNumber" dense class="elevation-3"
                        :items-per-page="15" @click:row="handleClickEmployee">

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
    </div>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
    name: 'EmployeeView',
    props: ['employeeNumber'],
    data() {
      return {
        employee: {firstName:'', lastName:''},        
        endpoint: 'http://localhost:8080/api/employees/',    
        selectedTab: null,  
        customers: [],
        customersHeaders: [
                {text: "customer Number", value: "customerNumber", width: '50px',  class:"blue lighten-5"},
                {text: "customer Name", value: "customerName", width: '150px',  class:"blue lighten-5"},
                {text: "contact LastName", value: "contactLastName", width: '5px',  class:"blue lighten-5"},
                {text: "contact FirstName", value: "contactFirstName", width: '5px',  class:"blue lighten-5"},
                {text: "phone", value: "phone", width: '150px',  class:"blue lighten-5"},
                {text: "address Line1", value: "addressLine1", width: '150px',  class:"blue lighten-5"},
                {text: "address Line2", value: "addressLine2", width: '5px',  class:"blue lighten-5"},
                {text: "city", value: "city", width: '5px',  class:"blue lighten-5"},
                {text: "state", value: "state", width: '5px',  class:"blue lighten-5"},
                {text: "postal Code", value: "postalCode", width: '5px',  class:"blue lighten-5"},
                {text: "country", value: "country", width: '5px',  class:"blue lighten-5"},
                {text: "salesRep EmployeeNumber", value: "salesRepEmployeeNumber", width: '5px',  class:"blue lighten-5"},
                {text: "credit Limit", value: "creditLimit", width: '5px', align: 'right',  class:"blue lighten-5"},
          ],

        employees: [],
        routeToEmployee: null ,
        employeeHeaders: [
                {text: "employeeNumber", value: "employeeNumber", width: '5px',  class:"blue lighten-5"},
                {text: "lastName", value: "lastName", width: '50px',  class:"blue lighten-5"},
                {text: "firstName", value: "firstName", width: '50px',  class:"blue lighten-5"},
                {text: "jobTitle", value: "jobTitle", width: '150px',  class:"blue lighten-5"},
                {text: "extension", value: "extension", width: '50px',  class:"blue lighten-5"},
                {text: "email", value: "email", width: '50px',  class:"blue lighten-5"},                
                {text: "reportsTo", value: "reportsToName", width: '50px',  class:"blue lighten-5"},
                {text: "city", value: "city", width: '50px',  class:"blue lighten-5"},                
          ],

      }
    },

    watch: {
        '$route'() {     
            console.log('watch');
            this.customers = [];       
            this.employees = [];       
            //this.selectedTab = 'first';
            this.getEmployee(this.employeeNumber);
            this.getCustomers(this.employeeNumber);
            this.getEmployees(this.employeeNumber);
        }
    },

  created() {
    console.log('created');
    this.getEmployee(this.employeeNumber);
    this.getCustomers(this.employeeNumber);
    this.getEmployees(this.employeeNumber);
  },

  computed: {

    getOffice() {
        return `${this.employee.city} (${this.employee.officeCode})`;
    },

    getReportsTo() {
        if( this.employee.reportsTo === null ) {
            return "n/a";
        }
        return `${this.employee.reportsToName} (${this.employee.reportsTo})`;
    },

  },

  methods: {    

    getEmployee(employeeNumber) {
        axios(this.endpoint + employeeNumber)
        .then(response => {
            this.employee = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

    getCustomers(employeeNumber) {
        axios(this.endpoint + employeeNumber + '/customers')
        .then(response => {
            this.customers = response.data
        })
        .catch( error => {
            console.log(error)
        })
    },

    getEmployees(employeeNumber) {
        axios(this.endpoint + employeeNumber + '/employees')
        .then(response => {
            this.employees = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },

    handleClickOffice () {
        router.push({path: `/offices/${this.employee.officeCode}`});
    },

    handleClickReportsTo () {
        router.push({path: `/employees/${this.employee.reportsTo}`});
    },

    handleClickEmployee (row) {
        console.log(row);      
        this.routeToEmployee = row.employeeNumber;  
        router.push({path: `/employees/${this.routeToEmployee}`});
    },

    handleClickCustomer(row) {
        console.log(row);
        router.push({path: `/customers/${row.customerNumber}`});
    },


    },

}
</script>
  