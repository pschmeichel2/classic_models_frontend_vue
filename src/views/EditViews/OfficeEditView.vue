<template>
    <div class="home">
        <p></p>
        <!--<v-form @submit="handleClickSave">-->
      <v-card max-width="1000px"  >

        <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" >{{ getTitle() }}</span>                        
                    <v-spacer></v-spacer>
                    <!--<v-btn dark icon type="submit"><v-icon>mdi-check</v-icon></v-btn>-->
                    <v-btn dark icon @click="handleClickSave"><v-icon>mdi-check</v-icon></v-btn>            
                    <v-btn dark icon @click="handleClickCancel"><v-icon>mdi-window-close</v-icon></v-btn>                
                </v-row>
            </v-card-title>

            <p></p>

        <v-card-text>
            <v-row >                
                <v-col cols="4">
                    <v-text-field label="City" v-model="city" dense class="font-weight-bold"  @keyup.enter="handleClickSave" 
                    maxlength="50" :rules="[rules.required, rules.cityCounter]" counter ref="cityRef" ></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Phone" v-model="phone" dense  @keyup.enter="handleClickSave" 
                    required maxlength="50"  :rules="[rules.required, rules.phoneCounter]" counter></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Office Code" v-model="officeCodeLocal" dense disabled
                    hint="system-generated" persistent-hint></v-text-field>
                </v-col>
            </v-row>

            <v-row >
                <v-col cols="4">
                    <v-text-field label="Country" v-model="country" dense class="font-weight-bold"  @keyup.enter="handleClickSave" 
                    required maxlength="50"  :rules="[rules.required, rules.countryCounter]" counter></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="State" v-model="state" dense  
                    maxlength="50"  :rules="[rules.stateCounter]" counter></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Postal Code" v-model="postalCode" dense  @keyup.enter="handleClickSave" 
                    required maxlength="15"  :rules="[rules.required, rules.postalCodeCounter]" counter></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field label="Territory" v-model="territory" dense  @keyup.enter="handleClickSave" 
                    required maxlength="10"  :rules="[rules.required, rules.territoryCounter]" counter></v-text-field>
                </v-col>
            </v-row>

            <v-row >
                <v-col cols="4">
                    <v-text-field label="Address Line1" v-model="addressLine1" dense  @keyup.enter="handleClickSave" 
                    required maxlength="50"  :rules="[rules.required, rules.addressLine1Counter]" counter></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="Address Line2" v-model="addressLine2" dense @keyup.enter="handleClickSave" 
                    maxlength="50"  :rules="[rules.addressLine2Counter]" counter></v-text-field>
                </v-col>
            </v-row>
            
        </v-card-text>
        <AlertBox ref="theAlertBox" v-show="showAlert"/>
      </v-card>      
    <!--</v-form>-->
    </div>
    
  </template>
  
<script>
import axios from 'axios';
import router from '@/router';
import AlertBox from '@/components/AlertBox.vue';

export default {
    name: 'OfficeEditView',
    props: ['officeCode'],

    data() {
      return {
        office: null,

        officeCodeLocal: '',
        city: '',
        cityLocal: '',
        phone: '',        
        country: '',
        state: '',
        postalCode: '',
        territory: '',
        addressLine1: '',
        addressLine2: '',

        endpoint: 'http://localhost:8080/api/offices',      
        showAlert: false,
        rules: {
            required: value => !!value || 'Required.',
            cityCounter: value => value.length <= 50 || 'Max 50 characters',
            phoneCounter: value => value.length <= 50 || 'Max 50 characters',
            addressLine1Counter: value => value.length <= 50 || 'Max 50 characters',
            addressLine2Counter: value => value.length <= 50 || 'Max 50 characters',
            stateCounter: value => value.length <= 50 || 'Max 50 characters',
            countryCounter: value => value.length <= 50 || 'Max 50 characters',
            postalCodeCounter: value => value.length <= 15 || 'Max 15 characters',
            territoryCounter: value => value.length <= 10 || 'Max 10 characters',
            email: value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Invalid e-mail.'
                },
        }
      }
    },

    components: {
      AlertBox
    },

    watch: {
        '$route'() {
            this.getOffice(this.officeCode);            
        }
    },

  created() {        
        this.getOffice(this.officeCode);    
        this.$refs.cityRef.focus();
    },

    mounted() {        
        this.$refs.cityRef.focus();
    },

  methods: {    

    getOffice(officeCode) {
        if (this.officeCode === undefined) {
            console.log('new');
            this.officeCodeLocal =  '';
            this.city = '';
            this.phone = '';
            this.country = '';
            this.state = '';
            this.postalCode = '';
            this.territory = '';
            this.addressLine1 = '';
            this.addressLine2 = '';

        } else {
            console.log('edit');
            axios(this.endpoint + '/' + officeCode)
            .then(response => {
                this.office = response.data;
                this.officeCodeLocal = this.office.officeCode;
                this.city = this.office.city;
                this.cityLocal = this.office.city;
                this.phone = this.office.phone;
                this.country = this.office.country;
                this.state = this.office.state;
                this.postalCode = this.office.postalCode;
                this.territory = this.office.territory;
                this.addressLine1 = this.office.addressLine1;
                this.addressLine2 = this.office.addressLine2;
            })
            .catch( error => {
                console.log(error);
            })
        }
      },

      handleClickSave() {
        if (this.officeCode === undefined) {
            this.saveNewAndClose();
        } else {
            this.saveEditAndClose();
        }
      },

      saveEditAndClose() {
        console.log('saveEditAndClose');
        var vm = this;        
        const request = this.endpoint + '/' + this.officeCode;
        const obj = {
            officeCode: this.officeCode, 
            city: this.city,
            phone: this.phone,
            country: this.country,
            state: this.state,
            postalCode: this.postalCode,
            territory: this.territory,
            addressLine1: this.addressLine1,
            addressLine2: this.addressLine2,
        };
        console.log('request=' + request);
        console.log('obj=' + JSON.stringify(obj));
        (async () => {await axios.put(request, obj)
            .then(response => {
                console.log('response', response);
                this.showAlert = false;
                router.push({path: `/offices/${this.office.officeCode}`});
            })
            .catch(error => {                
                console.error('There was an error!', error);
                this.showAlert = true;
                vm.$refs.theAlertBox.open( error.response.data.message, error.response.data.errors );
            })})();
      },

      saveNewAndClose() {
        console.log('saveNewAndClose');
        var vm = this;        
        const request = this.endpoint;
        const obj = {
            officeCode: this.officeCode, 
            city: this.city,
            phone: this.phone,
            country: this.country,
            state: this.state,
            postalCode: this.postalCode,
            territory: this.territory,
            addressLine1: this.addressLine1,
            addressLine2: this.addressLine2,
        };
        console.log('request=' + request);
        console.log('obj=' + JSON.stringify(obj));
        (async () => {await axios.post(request, obj)
            .then(response => {
                console.log('response', response);
                this.showAlert = false;
                this.officeCodeLocal = response.data.officeCode;
                router.push({path: `/offices/${this.officeCodeLocal}`});
            })
            .catch(error => {                
                console.error('There was an error!', error);
                this.showAlert = true;
                vm.$refs.theAlertBox.open( error.response.data.message, error.response.data.errors );
            })})();
      },

      handleClickCancel() {
        router.push({path: `/offices`});
      },

      getTitle() {
        if (this.officeCode === undefined) {
            return 'New Office';            
        } else {
            return `Edit Office ${this.officeCode} (${this.cityLocal})`;
        }
      },

      

    },

}
</script>
  