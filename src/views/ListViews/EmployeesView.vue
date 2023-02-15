<template>
    <div class="home">
        
    <v-card max-width="1400px"  >
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
            <span class="text-h5 white--text" >Employees</span>    
            <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
            <v-spacer></v-spacer>
            <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>        
        </v-row>
        </v-card-title>


      <v-data-table :items="employees" :headers="headers" item-key="employeeNumber" dense class="elevation-3"
          :items-per-page="15"  @click:row="handleClick"   :search="search">
          
        <template v-slot:item.lastName="{ item }">
          <span class="font-weight-bold">{{ item.lastName }}</span>
        </template>
        <template v-slot:item.firstName="{ item }">
          <span class="font-weight-bold">{{ item.firstName }}</span>
        </template>
        <template v-slot:item.jobTitle="{ item }">
          <span class="font-weight-bold">{{ item.jobTitle }}</span>
        </template>
        
        <template v-slot:footer.prepend>
            <v-btn plain @click="handleClickRefresh">Refresh</v-btn>             
          </template>

      </v-data-table>  

    </v-card>

    </div>
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
    name: 'EmployeesView',
    data() {
      return {        
        search: '',
        employees: [],
        endpoint: 'http://localhost:8080/api/employees',        
        headers: [
                {text: "EmployeeNumber", value: "employeeNumber", width: '5px',  class:"blue lighten-5"},
                {text: "LastName", value: "lastName", width: '50px',  class:"blue lighten-5"},
                {text: "FirstName", value: "firstName", width: '50px',  class:"blue lighten-5"},
                {text: "JobTitle", value: "jobTitle", width: '150px',  class:"blue lighten-5"},
                {text: "OfficeCode", value: "city", width: '50px',  class:"blue lighten-5"},
                {text: "Extension", value: "extension", width: '50px',  class:"blue lighten-5"},
                {text: "Email", value: "email", width: '50px',  class:"blue lighten-5"},                
                {text: "ReportsTo", value: "reportsToName", width: '50px',  class:"blue lighten-5"},
                
          ],

      }
    },

    watch: {
        '$route'() {
            this.getEmployees();
        }
    },

  created() {
    this.getEmployees();
  },

  methods: {    

    getEmployees() {
        axios(this.endpoint)
        .then(response => {
            this.employees = response.data
        })
        .catch( error => {
            console.log(error)
        })
      },
        
    handleClick(row) {
      console.log(row)
      router.push({path: `/employees/${row.employeeNumber}`})
    },

    handleClickRefresh() {
      this.getEmployees();
    },

  },
}
</script>
