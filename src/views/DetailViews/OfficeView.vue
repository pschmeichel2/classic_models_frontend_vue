<template>
    <div class="home">
        <p></p>
      <v-card max-width="1000px"  >

        <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >Office {{ $route.params.officeCode }} ({{ office.city }})</span>                        
                    <v-spacer></v-spacer>
                    <v-btn dark icon @click="handleClickAdd"><v-icon >mdi-plus-thick</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickEdit"><v-icon >mdi-pencil</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickDelete"><v-icon >mdi-delete</v-icon></v-btn>                
                </v-row>
        </v-card-title>

        <p></p>

        <v-card-text>
            <v-row >                
                <v-col cols="4">
                    <v-text-field label="City" v-model="office.city" dense class="font-weight-bold" readonly></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Phone" v-model="office.phone" dense readonly></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Office Code" v-model="office.officeCode" dense readonly></v-text-field>
                </v-col>
            </v-row>

            <v-row >
                <v-col cols="4">
                    <v-text-field label="Country" v-model="office.country" dense class="font-weight-bold" readonly></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="State" v-model="office.state" dense readonly></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Postal Code" v-model="office.postalCode" dense readonly></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Territory" v-model="office.territory" dense readonly></v-text-field>
                </v-col>
            </v-row>

            <v-row >
                <v-col cols="4">
                    <v-text-field label="AddressLine 1" v-model="office.addressLine1" dense readonly></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="AddressLine2" v-model="office.addressLine2" dense readonly></v-text-field>
                </v-col>
            </v-row>

        </v-card-text>
      </v-card>

      <p></p>

      <v-card flat max-width="1000px" >

        <v-card-title class="grey darken-1 ">
                <v-row class="ma-0">
                    <span class="text-5 white--text" >Employees</span>                        
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
            <OfficeDeleteDialog ref="theOfficeDeleteDialog" />
        </v-card>

    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';
import Office from '@/models/Office';
import OfficeDeleteDialog from '../EditViews/OfficeDeleteDialog.vue';


export default {
    name: 'OfficeView',
    props: ['officeCode'],
    components: {        
        OfficeDeleteDialog,
    },
    data() {
      return {
        office: new Office(),
        endpoint: process.env.VUE_APP_BASE_URL+'/offices/',      
        employees: [],
        employeeHeaders: [
                {text: "Employee Number", value: "employeeNumber", width: '5px',  class:"blue lighten-5"},
                {text: "Last Name", value: "lastName", width: '50px',  class:"blue lighten-5"},
                {text: "First Name", value: "firstName", width: '50px',  class:"blue lighten-5"},
                {text: "Job Title", value: "jobTitle", width: '150px',  class:"blue lighten-5"},
                {text: "Extension", value: "extension", width: '50px',  class:"blue lighten-5"},
                {text: "Email", value: "email", width: '50px',  class:"blue lighten-5"},                
                {text: "Reports To", value: "reportsToName", width: '50px',  class:"blue lighten-5"},
                //{text: "City", value: "city", width: '50px',  class:"blue lighten-5"},                
          ],
      }
    },

    watch: {
        '$route'() {
            this.getOffice(this.officeCode);
            this.getEmployees(this.officeCode);
        }
    },

    created() {
        this.getOffice(this.officeCode);
        this.getEmployees(this.officeCode);
    },

  methods: {    

    getOffice(officeCode) {
        axios(this.endpoint + officeCode)
        .then(response => {
            this.office = response.data;
        })
        .catch( error => {
            console.log(error);
        })
      },

      getEmployees(officeCode) {
        axios(this.endpoint + officeCode + '/employees')
        .then(response => {
            this.employees = response.data;
        })
        .catch( error => {
            console.log(error);
        })
      },

      handleClickEmployee(row) {
        console.log(row);
        router.push({path: `/employees/${row.employeeNumber}`});
      },

      handleClickAdd() {
        console.log({path: '/offices/new'});
        router.push({path: '/offices/new'});        
      },

      handleClickEdit() {
        console.log({path: `/offices/${this.officeCode}/edit`});
        router.push({path: `/offices/${this.officeCode}/edit`});
      },

      handleClickDelete() {
        console.log({path: `delete Office ${this.officeCode}`});
        var vm = this;
        vm.$refs.theOfficeDeleteDialog.open(this.office);
      },

    },

}
</script>
  