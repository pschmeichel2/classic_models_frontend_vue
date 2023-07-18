<template>
    <div class="home">
        <v-card max-width="1000px">

            <v-card-title class="blue darken-2">
                <v-row class="ma-1">
                    <span class="text-h5 white--text" id="header">{{ getTitle() }}</span>
                    <v-spacer></v-spacer>
                </v-row>
            </v-card-title>

            <p></p>
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Last Name" v-model="employee.lastName" dense class="font-weight-bold"
                            ref="lastNameRef" maxlength="50" :rules="[rules.required, rules.nameCounter]"
                            counter></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="First Name" v-model="employee.firstName" dense class="font-weight-bold"
                            maxlength="50" :rules="[rules.required, rules.nameCounter]" counter></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-combobox label="Job Title" v-model="employee.jobTitle" :items="jobTitlesValues" dense
                            class="font-weight-bold" @keyup.enter="handleClickSave" required maxlength="50"
                            :rules="[rules.required, rules.countryCounter]" counter clearable>
                        </v-combobox>

                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-select label="Office" v-model="employee.officeCode" :items="officesValues" dense
                            class="font-weight-bold" item-value="officeCode" item-text="city"
                            @keyup.enter="handleClickSave">
                        </v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-select label="Manager" v-model="employee.reportsTo" :items="employeesValues" dense
                            class="font-weight-bold" item-value="employeeNumber" item-text="lastName"
                            @keyup.enter="handleClickSave">
                        </v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Employee Number" v-model="employee.employeeNumber" dense type="number" required
                            maxlength="5" :rules="[rules.required]" :disabled=isChangeMode>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Extension" v-model="employee.extension" dense maxlength="10"
                            :rules="[rules.required, rules.extensionCounter]" counter></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Email" v-model="employee.email" dense maxlength="100"
                            :rules="[rules.required, rules.emailCounter, rules.email]" counter></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                </v-row>

            </v-card-text>
            <v-card-actions>
                <v-btn color="secondary" @click="handleClickCancel" text>Cancel</v-btn>
                <v-btn color="primary" @click="handleClickSave" type="submit" id="saveOrder">Save</v-btn>
            </v-card-actions>

        </v-card>
        <p></p>
        <v-snackbar v-model="showSnackbar" :timeout="snackbarTimeout" light centered multi-line>
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
        <AlertBox ref="theAlertBox" v-show="showAlert" />
    </div>
</template>


<script>
import axios from 'axios';
import router from '@/router';
import AlertBox from '../../components/AlertBox.vue';
import Employee from '../../models/Employee.js';



export default {
    name: 'EmployeeEditView',
    props: ['employeeNumber'],
    components: {
        AlertBox,
    },
    data() {
        return {
            employee: new Employee(),
            officesValues: [],
            employeesValues: [],
            jobTitlesValues: [],
            maxEmployeeNumber: 0,
            endpoint: process.env.VUE_APP_BASE_URL + '/employees',
            officesEndpoint: process.env.VUE_APP_BASE_URL + '/offices',
            showAlert: false,
            showSnackbar: false,
            snackbarText: '',
            snackbarTimeout: 2000,

            rules: {
                required: value => !!value || 'Required',
                nameCounter: value => value.length <= 50 || 'Max 50 characters',
                countryCounter: value => value.length <= 50 || 'Max 50 characters',
                employeeNumberCounter: value => value.length <= 5 || 'Max 5 characters',
                extensionCounter: value => value.length <= 10 || 'Max 10 characters',
                emailCounter: value => value.length <= 100 || 'Max 100 characters',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || 'Invalid e-mail.';
                },

            }
        }
    },

    created() {
        console.log('created');
        this.getOffices();
        this.getEmployees();
        if (this.isChangeMode) {
            this.getEmployee(this.employeeNumber);
        } else {
            this.employee = new Employee();
        }
        setTimeout(() => {
            this.$refs.lastNameRef.focus();
        });
        console.log('created');
    },

    computed: {
        isChangeMode() {
            return !(this.employeeNumber === undefined);
        },

    },

    methods: {

        getEmployee(employeeNumber) {
            axios(this.endpoint + '/' + employeeNumber)
                .then(response => {
                    this.employee = response.data;
                })
                .catch(error => {
                    console.log(error);
                })
        },

        getOffices() {
            console.log('getOffices()');
            const request = this.officesEndpoint;
            axios(request)
                .then(response => {
                    this.officesValues = response.data;
                    console.log(this.officesValues);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        getEmployees() {
            console.log('getEmployees()');
            const request = this.endpoint;
            axios(request)
                .then(response => {
                    this.employeesValues = response.data;
                    if (!this.isChangeMode) {
                        this.maxEmployeeNumber = this.getMaxEmployeeNumber();
                        this.employee.employeeNumber = this.maxEmployeeNumber + 1;
                    }
                    let jobTitles = this.employeesValues.map(x => x.jobTitle);
                    this.jobTitlesValues = [...new Set(jobTitles)];
                })
                .catch(error => {
                    console.log(error);
                });
        },


        handleClickCancel() {
            router.push({ path: `/employees` });
        },

        handleClickSave: function () {
            console.log('handleClickSave');
            this.showSnackbar = false;
            if (!this.validateEmployee()) {
                this.showSnackbar = true;
            } else {
                if (this.isChangeMode) {
                    this.saveEditAndClose();

                } else {
                    this.saveNewAndClose();
                }
            }
        },

        validateEmployee() {
            this.snackbarText = '';

            if (this.employee.lastName.trim() === '') {
                this.snackbarText = 'Please enter a Last Name';
                return false;
            }
            if (this.employee.firstName.trim() === '') {
                this.snackbarText = 'Please enter a First Name';
                return false;
            }
            if (this.employee.jobTitle.trim() === '') {
                this.snackbarText = 'Please enter a Job Title';
                return false;
            }
            if (this.employee.officeCode.trim() === '') {
                this.snackbarText = 'Please enter an Office';
                return false;
            }
            // TODO only allow empty manager if job title is President
            // TODO employee cant be his own manager
            /*
            if (this.reportsTo.trim() === '') {
                this.snackbarText = 'Please enter a Manager';
                return false;
            }
            */
            if (!this.isChangeMode && (
                isNaN(this.employee.employeeNumber) ||
                Number.parseInt(this.employee.employeeNumber, 10) <= 0 ||
                !this.isNumeric(this.employee.employeeNumber) )) {
                this.snackbarText = 'Please enter a valid Employee Number';
                return false;
            }
            if (!this.isChangeMode && 
                this.checkIfEmployeeNumberExists(this.employee.employeeNumber)) {
                this.snackbarText = 'Duplicate Employee Number';
                return false;
            }
            if (this.employee.extension.trim() === '') {
                this.snackbarText = 'Please enter an Extension';
                return false;
            }
            // TODO check regex for email
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (this.employee.email.trim() === '' ||
                !pattern.test(this.employee.email)) {
                this.snackbarText = 'Please enter a valid Email address';
                return false;
            }

            return true;
        },

        saveNewAndClose() {
            console.log('saveNewAndClose');
            var vm = this;
            const request = this.endpoint;
            const obj = {
                employeeNumber: this.employee.employeeNumber,
                lastName: this.employee.lastName.trim(),
                firstName: this.employee.firstName.trim(),
                extension: this.employee.extension.trim(),
                email: this.employee.email.trim(),
                officeCode: this.employee.officeCode.trim(),
                reportsTo: this.employee.reportsTo,
                jobTitle: this.employee.jobTitle.trim(),
            };
            console.log('request=' + request);
            console.log('obj=' + JSON.stringify(obj));
            (async () => {
                await axios.post(request, obj)
                    .then(response => {
                        console.log('response', response);
                        this.showAlert = false;
                        this.employee.employeeNumber = response.data.employeeNumber;
                        router.push({ path: `/employees/${this.employee.employeeNumber}` });
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                        this.showAlert = true;
                        vm.$refs.theAlertBox.open(error.response.data.message, error.response.data.errors);
                    })
            })();
        },

        saveEditAndClose() {
            console.log('saveEditAndClose');
            const request = this.endpoint + '/' + this.employeeNumber;
            const obj = {
                employeeNumber: this.employeeNumber,
                lastName: this.employee.lastName.trim(),
                firstName: this.employee.firstName.trim(),
                extension: this.employee.extension.trim(),
                email: this.employee.email.trim(),
                officeCode: this.employee.officeCode.trim(),
                reportsTo: this.employee.reportsTo,
                jobTitle: this.employee.jobTitle.trim(),
            };
            console.log('request=' + request);
            console.log('obj=' + JSON.stringify(obj));
            (async () => {
                await axios.put(request, obj)
                    .then(response => {
                        console.log('response', response);
                        this.showAlert = false;
                        router.push({ path: `/employees/${this.employeeNumber}` });
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                        this.showAlert = true;
                        this.$refs.theAlertBox.open(error.response.data.message, error.response.data.errors);
                    })
            })();
        },

        isNumeric(value) {
            return /^-?\d+$/.test(value);
        },

        getTitle() {
            if (this.employeeNumber === undefined) {
                return 'New Employee';
            } else {
                return `Edit Employee ${this.employeeNumber}`;
            }
        },

        getMaxEmployeeNumber: function () {
            let maxValue = 0;
            for (let i = 0; i < this.employeesValues.length; i++) {
                const value = this.employeesValues[i].employeeNumber;
                if (value > maxValue) {
                    maxValue = value;
                }
            }
            return maxValue;
        },

        checkIfEmployeeNumberExists: function(employeeNumber) {
            const employeeNumberNum = Number.parseInt(employeeNumber, 10);
            const exists = this.employeesValues.some(e => e.employeeNumber === employeeNumberNum);
            return exists;
        }
    }
}
</script>
