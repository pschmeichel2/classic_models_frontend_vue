<template>
    <v-dialog persistent v-model="show" max-width="1000px" ref="Dialog" @keydown.esc="show = false">
        <v-card>

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text">Find Customer</span>
                    <v-spacer></v-spacer>
                </v-row>
            </v-card-title>

            <p></p>

            <v-card-text>

                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="5">
                                <v-text-field label="Customer Name" dense v-model="customerName" maxlength="50"
                                    :rules="[rules.customerNameCounter]" counter @keyup.enter="find()"
                                    ref="customerNameRef" />
                            </v-col>
                        </v-row><v-row>
                            <v-col cols="5">
                                <v-text-field label="Contact Last Name" dense v-model="contactLastName" maxlength="50"
                                    :rules="[rules.contactLastNameCounter]" counter @keyup.enter="find()" />
                            </v-col>
                            <v-col cols="5">
                                <v-text-field label="Contact First Name" dense v-model="contactFirstName" maxlength="50"
                                    :rules="[rules.contactFirstNameCounter]" counter @keyup.enter="find()" />
                            </v-col>
                        </v-row><v-row>
                            <v-col cols="5" class="ma-1">
                                <v-select v-model="country" :items="countryValues" label="Country" dense clearable>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="find" type="submit">Find</v-btn>
                    </v-card-actions>
                </v-card>

                <p></p>

                <v-card>

                    <v-card-text>
                        <v-data-table :items="customers" :headers="customersHeaders" item-key="customerNumber" dense
                            class="elevation-3" :items-per-page="15" @click:row="handleClickCustomer"
                            @dblclick:row="($event, { item }) => handleDblClickCustomer(item)" height="250px" v-model="selected"
                            ref="customerTableRef" :single-select="true" show-select>

                            <template v-slot:item.customerName="{ item }">
                                <span class="font-weight-bold">{{ item.customerName }}</span>
                            </template>
                            <template v-slot:item.salesRepEmployeeName="{ item }">
                                <span class="font-weight-bold">{{ item.salesRepEmployeeName }}</span>
                            </template>
                            <template v-slot:item.country="{ item }">
                                <span class="font-weight-bold">{{ item.country }}</span>
                            </template>

                        </v-data-table>

                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="secondary" @click="close" text>Cancel</v-btn>
                        <v-btn color="primary" @click="submit" type="submit">Ok</v-btn>
                    </v-card-actions>

                </v-card>
            </v-card-text>
        </v-card>

    </v-dialog>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../../main";



export default {
    name: 'CustomerSearchDialog',
    data() {
        return {
            endpoint: process.env.VUE_APP_BASE_URL+'/customers',
            countryEndpoint: process.env.VUE_APP_BASE_URL+'/countries',
            show: false,
            country: '',
            customerName: '',
            contactFirstName: '',
            contactLastName: '',
            customers: [],
            countryValues: [],
            selected: [],
            customersHeaders: [
                //{text: "Customer Number", value: "customerNumber", width: '50px',  class:"blue lighten-5", sortable: false},
                { text: "Customer Name", value: "customerName", width: '150px', class: "blue lighten-5", sortable: false },
                { text: "Contact Last Name", value: "contactLastName", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "Contact First Name", value: "contactFirstName", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "Sales Rep", value: "salesRepEmployeeName", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "Phone", value: "phone", width: '150px', class: "blue lighten-5", sortable: false },
                { text: "Address Line1", value: "addressLine1", width: '150px', class: "blue lighten-5", sortable: false },
                { text: "Address Line2", value: "addressLine2", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "City", value: "city", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "State", value: "state", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "Postal Code", value: "postalCode", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "Country", value: "country", width: '5px', class: "blue lighten-5", sortable: false },
                { text: "Credit Limit", value: "creditLimit", width: '5px', align: 'right', class: "blue lighten-5", sortable: false },
            ],
            rules: {
                customerNameCounter: value => value.length <= 50 || 'Max 50 characters',
                contactLastNameCounter: value => value.length <= 50 || 'Max 50 characters',
                contactFirstNameCounter: value => value.length <= 50 || 'Max 50 characters',
            },

        }
    },

    methods: {

        open: function () {
            this.show = true;
            this.country = '';
            this.customerName = '';
            this.contactFirstName = '';
            this.contactLastName = '';
            this.customers = [];
            this.countryValues = [];
            this.getCountries();
            setTimeout(() => {
                this.$refs.customerNameRef.$refs.input.select();
            });
        },

        submit: function () {
            console.log('submit');
            const row = this.selected[0];
            eventBus.$emit("customer-selected", row);
            this.show = false;
        },

        find: function () {
            this.getCustomers();
        },

        close: function () {
            this.show = false;
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

        getCustomers() {
            console.log('getCustomers()');
            const request = this.endpoint
                + '?customerName=' + (this.customerName === null ? '' : this.customerName.trim())
                + '&contactLastName=' + (this.contactLastName === null ? '' : this.contactLastName.trim())
                + '&contactFirstName=' + (this.contactFirstName === null ? '' : this.contactFirstName.trim())
                + '&country=' + (this.country === null ? '' : this.country.trim());
            axios(request)
                .then(response => {
                    if( response.data === "") {
                        this.customers = [];
                    }
                    else {
                        this.customers = response.data;
                        if (this.customers.length > 0) {
                            const firstCustomer = this.customers[0];
                            this.selected = [firstCustomer];

                            /* doesn't work, table rows can't be keyboard selected with v-data-table
                            setTimeout(() => {
                            this.$refs.customerTableRef.$el.__vue__.$children[0].focus();
                            });
                            */
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },

        handleClickCustomer(row) {
            console.log('handleClickCustomer');
        },

        handleDblClickCustomer(row) {
            console.log('handleDblClickCustomer', row);
            eventBus.$emit("customer-selected", row);
            this.show = false;
        },

    },
}
</script>        