<template>
    <v-dialog v-model="show" max-width="500px">
          <v-card>
            <v-card-title>{{title}}</v-card-title>
            <v-card-text>
              <v-text-field readonly label="customerId" v-model="customerId" v-show="showId"/>
              <v-text-field label="firstName" v-model="firstName" ref="firstNameRef" @keyup.enter="saveAndClose()"/>
              <v-text-field label="lastName" v-model="lastName"  @keyup.enter="saveAndClose()"/>              
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" text @click="show=false">Close</v-btn>
              <v-btn color="primary" dark @click="saveAndClose" type="submit">Save</v-btn>
            </v-card-actions>
          </v-card>
          <AlertBox ref="theAlertBox" v-show="showAlert"/>
    </v-dialog>
</template>
        
<script>
import axios from 'axios';
import AlertBox from '@/components/AlertBox.vue';
import { eventBus } from "../main";

export default {
    name: 'CustomerEditDialog',
    data() {
        return {      
            endpoint: 'http://localhost:8080/api/customers',
            show: false,
            customerId: 0,
            firstName: '',
            lastName: '',
            title: '',
            alertMessage: 'an alert',
            showAlert: false,
            success: undefined,
            showId: true
        }
    },

    components: {
      AlertBox
    },


    methods: {

        open: function (row) {
            var vm = this;
            console.log('open', row)
            if( row ) {
              this.customerId = row.id;
              this.firstName = row.firstName;
              this.lastName = row.lastName;
              this.title = 'Edit Customer';
              this.showId = true;
            } else {
              this.customerId = undefined;
              this.firstName = '';
              this.lastName = '';
              this.title = 'New Customer';
              this.showId = false;
            }
            this.showAlert = false;
            this.alertMessage = '';            
            vm.show = true;

            setTimeout(() => {
              this.$refs.firstNameRef.$refs.input.select();
            })
            
        },

        saveAndClose: function (row) {
          if( this.customerId ) {
            this.saveEditAndClose(row);
          } else {
            this.saveNewAndClose(row);
          }
        }, 

       saveEditAndClose: function (row) {
            var vm = this;
            this.showAlert = false;
            console.log('saveEditAndClose', row);
            const request = this.endpoint + '/' + this.customerId;
            const obj = {firstName: this.firstName, lastName: this.lastName};
            console.log('request: ', request);
            console.log('obj', obj);
            this.success = true;
            (async () => {await axios.put(request, obj)
              .then(response => {
                console.log('response', response);
                eventBus.$emit("customer-changed", {firstName: this.firstName, lastName: this.lastName});
                vm.show = false;
              })
              .catch(error => {                
                console.error('There was an error!', error);
                this.showAlert = true;
                vm.$refs.theAlertBox.open( error.response.data.message, error.response.data.errors );
                this.success = false;
              })})();
        },

        saveNewAndClose: function (row) {
            var vm = this;
            this.showAlert = false;
            console.log('saveNewAndClose', row);
            const request = this.endpoint;
            const obj = {firstName: this.firstName, lastName: this.lastName};
            console.log('request: ', request);
            console.log('obj', obj);
            this.success = true;
            (async () => {await axios.post(request, obj)
              .then(response => {
                console.log('response', response);
                this.customerId = response.data.id;
                eventBus.$emit("customer-created", {id: this.customerId, firstName: this.firstName, lastName: this.lastName});
                vm.show = false;
              })
              .catch(error => {                
                console.error('There was an error!', error);
                this.showAlert = true;
                vm.$refs.theAlertBox.open( error.response.data.message, error.response.data.errors );
                this.success = false;
              })})();
        },

    },
}
</script>        