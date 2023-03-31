<template>
    <div class="home">
        <p></p>
        <!--<v-form @submit="handleClickSave">-->
        <v-card max-width="1000px">

            <v-card-title class="blue darken-2 ">
                <v-row class="ma-1">
                    <span class="text-h5 white--text">{{ getTitle() }}</span>
                    <v-spacer></v-spacer>
                    <!--<v-btn dark icon type="submit"><v-icon>mdi-check</v-icon></v-btn>-->
                    <v-btn dark icon @click="handleClickSave"><v-icon>mdi-check</v-icon></v-btn>
                    <v-btn dark icon @click="handleClickCancel"><v-icon>mdi-window-close</v-icon></v-btn>
                </v-row>
            </v-card-title>

            <p></p>

            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="City" v-model="city" dense class="font-weight-bold"
                            @keyup.enter="handleClickSave" maxlength="50" :rules="[rules.required, rules.cityCounter]"
                            counter ref="cityRef"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Phone" v-model="phone" dense @keyup.enter="handleClickSave" required
                            maxlength="50" :rules="[rules.required, rules.phoneCounter]" counter></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field label="Office Code" v-model="officeCodeLocal" dense disabled hint="system-generated"
                            persistent-hint></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-combobox label="Country" v-model="country" :items="countryValues" dense class="font-weight-bold"
                            @keyup.enter="handleClickSave" required maxlength="50"
                            :rules="[rules.required, rules.countryCounter]" counter clearable>
                        </v-combobox>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="State" v-model="state" dense maxlength="50" :rules="[rules.stateCounter]"
                            counter hint="e.g. NY,CA,MA (not required)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field label="Postal Code" v-model="postalCode" dense @keyup.enter="handleClickSave" required
                            maxlength="15" :rules="[rules.required, rules.postalCodeCounter]" counter
                            hint="https://en.wikipedia.org/wiki/List_of_postal_codes">
                        </v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field label="Territory" v-model="territory" dense @keyup.enter="handleClickSave" required
                            maxlength="10" :rules="[rules.required, rules.territoryCounter]" counter
                            hint="e.g. EMEA"></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Address Line1" v-model="addressLine1" dense @keyup.enter="handleClickSave"
                            required maxlength="50" :rules="[rules.required, rules.addressLine1Counter]"
                            counter></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Address Line2" v-model="addressLine2" dense @keyup.enter="handleClickSave"
                            maxlength="50" :rules="[rules.addressLine2Counter]" counter clearable
                            hint="not required"></v-text-field>
                    </v-col>
                </v-row>

            </v-card-text>
            <AlertBox ref="theAlertBox" v-show="showAlert" />

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
import AlertBox from '@/components/AlertBox.vue';
import Office from '@/models/Office';

export default {
    name: 'OfficeEditView',
    props: ['officeCode'],

    data() {
        return {
            office: new Office(),
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
            countryValues: [],
            endpoint: 'http://localhost:8080/api/offices',
            countryEndpoint: 'http://localhost:8080/api/countries',
            showAlert: false,

            showSnackbar: false,
            snackbarText: '',
            snackbarTimeout: 2000,

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
        this.showSnackbar = false;
        this.snackbarText = '';
        this.getOffice(this.officeCode);
        this.getCountries();
        setTimeout(() => {
            this.$refs.cityRef.focus();
        });
    },

    mounted() {
        this.$refs.cityRef.focus();
    },

    methods: {

        getOffice(officeCode) {
            if (this.officeCode === undefined) {
                console.log('new');
                this.officeCodeLocal = '';
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
                    .catch(error => {
                        console.log(error);
                    })
            }
        },

        handleClickSave() {
            console.log('handleClickSave');
            this.showSnackbar = false;
            if (!this.validateOffice()) {
                this.showSnackbar = true;
            } else {

                if (this.officeCode === undefined) {
                    this.saveNewAndClose();
                } else {
                    this.saveEditAndClose();
                }
            }
        },

        validateOffice() {
            this.snackbarText = '';
            if (this.city.trim() === '') {
                this.snackbarText = 'Please enter a city';
                return false;
            }
            if (this.phone.trim() === '') {
                this.snackbarText = 'Please enter a phone';
                return false;
            }
            if (this.country === null || this.country.trim() === '') {
                this.snackbarText = 'Please enter a country';
                return false;
            }
            if (this.postalCode.trim() === '') {
                this.snackbarText = 'Please enter a postalCode';
                return false;
            }
            if (this.country !== null
                && this.country.toLowerCase() === 'germany'
                && !this.isValidGermanPostalCode(this.postalCode.trim())) {
                this.snackbarText = 'Please enter a valid german postalcode';
                return false;
            }
            if (this.territory.trim() === '') {
                this.snackbarText = 'Please enter a territory';
                return false;
            }
            if (this.addressLine1.trim() === '') {
                this.snackbarText = 'Please enter an address line 1';
                return false;
            }
            return true;
        },

        saveEditAndClose() {
            console.log('saveEditAndClose');
            const request = this.endpoint + '/' + this.officeCode;
            const obj = {
                officeCode: this.officeCode.trim(),
                city: this.city.trim(),
                phone: this.phone.trim(),
                country: this.country.trim(),
                state: this.state.trim(),
                postalCode: this.postalCode.trim(),
                territory: this.territory.trim(),
                addressLine1: this.addressLine1.trim(),
                addressLine2: this.addressLine2.trim(),
            };
            console.log('request=' + request);
            console.log('obj=' + JSON.stringify(obj));
            (async () => {
                await axios.put(request, obj)
                    .then(response => {
                        console.log('response', response);
                        this.showAlert = false;
                        router.push({ path: `/offices/${this.office.officeCode}` });
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                        this.showAlert = true;
                        this.$refs.theAlertBox.open(error.response.data.message, error.response.data.errors);
                    })
            })();
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
            (async () => {
                await axios.post(request, obj)
                    .then(response => {
                        console.log('response', response);
                        this.showAlert = false;
                        this.officeCodeLocal = response.data.officeCode;
                        router.push({ path: `/offices/${this.officeCodeLocal}` });
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                        this.showAlert = true;
                        vm.$refs.theAlertBox.open(error.response.data.message, error.response.data.errors);
                    })
            })();
        },

        handleClickCancel() {
            router.push({ path: `/offices` });
        },

        getTitle() {
            if (this.officeCode === undefined) {
                return 'New Office';
            } else {
                return `Edit Office ${this.officeCode} (${this.cityLocal})`;
            }
        },

        getCountries() {
            console.log('getCountries()');
            const request = this.countryEndpoint;
            axios(request)
                .then(response => {
                    this.countryValues = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        isValidGermanPostalCode(value) {
            //return /^-?\d+$/.test(value);
            return /^[0-9]{5}$/.test(value);
        },

    },

}
</script>
  