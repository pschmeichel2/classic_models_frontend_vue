<template>
  <v-dialog persistent v-model="show" max-width="500px" @keydown.esc="show = false">
    <v-card>
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text">Delete Order</span>
        </v-row>
      </v-card-title>
      <p></p>
      <p></p>
      <v-card-text>
        <h3 class="font-weight-bold mb-3">Delete this Order?</h3>
        <span class="font-weight-bold mb-2">{{ orderNumber }}</span>
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

export default {
  name: 'OrderDeleteDialog',
  data() {
    return {
      endpoint: process.env.VUE_APP_BASE_URL+'/orders',
      show: false,
      orderNumber: 0,
      alertMessage: 'an alert',
      showAlert: false,
      success: undefined,
    }
  },

  components: {
    AlertBox
  },

  methods: {

    open: function (orderNumber) {
      var vm = this;
      console.log('open', orderNumber);
      this.orderNumber = orderNumber;
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
      const request = this.endpoint + '/' + this.orderNumber;
      console.log('request: ', request);
      this.success = true;
      (async () => {
        await axios.delete(request)
          .then(response => {
            console.log('response', response);
            vm.show = false;
            router.push({ path: `/orders` });
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