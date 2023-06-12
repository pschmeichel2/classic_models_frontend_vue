<template>
  <v-dialog persistent v-model="show" max-width="500px" @keydown.esc="show = false">
    <v-card>
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text">Delete Order Detail</span>
        </v-row>
      </v-card-title>
      <p></p>
      <p></p>
      <v-card-text>
        <h3 class="font-weight-bold mb-3">Delete this Order Detail?</h3>
        <span class="font-weight-bold mb-2">{{ productName }}</span>
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
import OrderDetail from '../../models/OrderDetail.js';
import { eventBus } from "../../main";

export default {
  name: 'OrderDetailDeleteDialog',
  data() {
    return {
      endpoint: process.env.VUE_APP_BASE_URL+'/orderDetails',
      show: false,
      orderDetail: new OrderDetail(),
      orderNumber: 0,
      orderLineNumber: 0,
      productName: '',
      alertMessage: 'an alert',
      showAlert: false,
      success: undefined,
    }
  },

  components: {
    AlertBox
  },

  methods: {

    open: function (orderDetail) {
      var vm = this;
      console.log('open', orderDetail.orderNumber);
      this.orderDetail = orderDetail;
      this.orderNumber = orderDetail.orderNumber;
      this.orderLineNumber = orderDetail.orderLineNumber;
      this.productName = orderDetail.productName;
      this.showAlert = false;
      this.alertMessage = '';
      vm.show = true;

      setTimeout(() => {
        this.$refs.deleteButtonRef.$el.focus();
      })
    },

    deleteAndClose: function () {
      console.log('deleteAndClose');
      this.showAlert = false;
      eventBus.$emit("orderDetail-deleted", this.orderDetail);
      this.show = false;
    },

  },
}
</script>        