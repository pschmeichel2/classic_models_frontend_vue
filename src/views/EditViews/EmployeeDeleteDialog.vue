<template>
  <v-dialog persistent v-model="show" max-width="500px" @keydown.esc="show = false">
    <v-card>
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text">Delete Employee</span>
        </v-row>
      </v-card-title>
      <p></p>
      <p></p>
      <v-card-text>
        <h3 class="font-weight-bold mb-3">Delete this Employee?</h3>
        <span class="font-weight-bold mb-2">{{ lastName }}, {{ firstName }}</span>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" text @click="show = false">Cancel</v-btn>
        <v-btn color="primary" dark @click="deleteAndClose" ref="deleteButtonRef">Delete</v-btn>
      </v-card-actions>
    </v-card>
    <AlertBox ref="theAlertBox" v-show="showAlert" />
  </v-dialog>
</template>
        
<script>
import axios from 'axios';
import AlertBox from '@/components/AlertBox.vue';
import router from '@/router';
import Employee from '@/models/Employee';

export default {
  name: 'EmployeeDeleteDialog',
  data() {
    return {
      employee: new Employee(),
      lastName: '',
      firstName: '',
      endpoint: process.env.VUE_APP_BASE_URL + '/employees',
      show: false,
      employeeNumber: 0,
      alertMessage: 'an alert',
      showAlert: false,
      success: undefined,
    }
  },

  components: {
    AlertBox
  },

  methods: {

    open: function (employeeNumber) {
      var vm = this;
      console.log('open', employeeNumber);
      this.employeeNumber = employeeNumber;
      this.getEmployee(this.employeeNumber);
      this.showAlert = false;
      this.alertMessage = '';
      vm.show = true;

      setTimeout(() => {
        this.$refs.deleteButtonRef.$el.focus();
      })
    },

    getEmployee(employeeNumber) {
      axios(this.endpoint + '/' + employeeNumber)
        .then(response => {
          this.employee = response.data;
          this.lastName = this.employee.lastName;
          this.firstName = this.employee.firstName;
        })
        .catch(error => {
          console.log(error)
        })
    },

    deleteAndClose: function (row) {
      var vm = this;
      this.showAlert = false;
      console.log('deleteAndClose', row);
      const request = this.endpoint + '/' + this.employeeNumber;
      console.log('request: ', request);
      this.success = true;
      (async () => {
        await axios.delete(request)
          .then(response => {
            console.log('response', response);
            vm.show = false;
            router.push({ path: `/employees` });
          })
          .catch(error => {
            console.error('There was an error!', error, error.response.data.message);
            this.showAlert = true;
            vm.$refs.theAlertBox.open(error.response.data.message, error.response.data.errors);
            this.success = false;
          })
      })();
    },

  },
}
</script>        