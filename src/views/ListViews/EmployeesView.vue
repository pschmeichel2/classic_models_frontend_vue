<template>
  <div class="home">

    <v-card max-width="1400px">
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text" id="header">Employees</span>
          <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
        </v-row>
      </v-card-title>


      <v-data-table :items="employees" :headers="headers" item-key="employeeNumber" dense class="elevation-3"
        :items-per-page="15" @click:row="handleClick" :search="search">

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

export default {
  name: 'EmployeesView',
  title: 'Classic Models - Employees',
  data() {
    return {
      search: '',
      employees: [],

      showSnackbar: false,
      snackbarText: '',
      snackbarTimeout: 2000,

      endpoint: process.env.VUE_APP_BASE_URL+'/employees',
      headers: [
        { text: "Employee Number", value: "employeeNumber", width: '5px', class: "blue lighten-5" },
        { text: "Last Name", value: "lastName", width: '50px', class: "blue lighten-5" },
        { text: "First Name", value: "firstName", width: '50px', class: "blue lighten-5" },
        { text: "Job Title", value: "jobTitle", width: '150px', class: "blue lighten-5" },
        { text: "Office", value: "city", width: '50px', class: "blue lighten-5" },
        { text: "Extension", value: "extension", width: '50px', class: "blue lighten-5" },
        { text: "Email", value: "email", width: '50px', class: "blue lighten-5" },
        { text: "Reports To", value: "reportsToName", width: '50px', class: "blue lighten-5" },
      ],
    }
  },

  watch: {
    '$route'() {
      this.getEmployees();
    }
  },

  created() {
    this.showSnackbar = false;
    this.snackbarText = '';
    this.getEmployees();
  },

  methods: {

    getEmployees() {
      axios(this.endpoint)
        .then(response => {
          this.employees = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    handleClick(row) {
      console.log(row);
      router.push({ path: `/employees/${row.employeeNumber}` });
    },

    handleClickRefresh() {
      this.getEmployees();
    },

    handleClickAdd() {
      router.push({ path: `/employees/new` });
    },

  },
}
</script>
