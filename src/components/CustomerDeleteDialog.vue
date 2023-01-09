<template>
    <v-dialog v-model="show" max-width="500px">
          <v-card>
            <v-card-title>Delete Customer</v-card-title>
            <v-card-text>
              <h3 class="font-weight-bold mb-3">Delete this customer?</h3>              
              <div class="font-weight-bold">{{firstName}} {{lastName}}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="secondary" text @click="show=false">Cancel</v-btn>
              <v-btn color="primary" dark @click="deleteAndClose" ref="deleteButtonRef">Delete</v-btn>
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
    name: 'CustomerDeleteDialog',
    data() {
        return {      
            endpoint: 'http://localhost:8080/api/customers',
            show: false,
            customerId: 0,
            firstName: '',
            lastName: '',
            alertMessage: 'an alert',
            showAlert: false,
            success: undefined,
        }
    },

    components: {
      AlertBox
    },

    methods: {

        open: function (row) {
            var vm = this;
            console.log('open', row)
            this.customerId = row.id
            this.firstName = row.firstName
            this.lastName = row.lastName
            this.showAlert = false;
            this.alertMessage = '';            
            vm.show = true;

            setTimeout(() => {
              this.$refs.deleteButtonRef.$el.focus();
            })
        },

       deleteAndClose: function (row) {
            var vm = this;
            this.showAlert = false;
            console.log('deleteAndClose', row);
            const request = this.endpoint + '/' + this.customerId;            
            console.log('request: ', request);            
            this.success = true;
            (async () => {await axios.delete(request)
              .then(response => {
                console.log('response', response);
                eventBus.$emit("customer-deleted", {id: this.customerId});
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