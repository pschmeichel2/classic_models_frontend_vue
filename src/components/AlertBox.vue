<template>
    <v-alert v-model="showAlert" type="error">
        <li v-for="(error, index) in errors" :key="`error-${index}`" class="text-left">
            {{ error }}
        </li>   
        <div v-if="!errors || errors.length === 0">{{ message }}</div>
    </v-alert>
</template>

<script>


export default {
    name: 'AlertBox',
    data() {
      return {        
        errors: [],
        message: '',
        showAlert: false,
        alertMessage: 'an alert',        
      }
    },

    methods: {

        open: function (message, errors) {
            var vm = this;
            this.errors = errors;
            this.message = message;
            vm.showAlert = true;
        },

        close: function() {
            var vm = this;
            vm.showAlert = false;
        }
    },
}
</script>