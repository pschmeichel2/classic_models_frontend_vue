<template>
  <div class="home">

    <v-card max-width="1400px">
      <v-card-title class="blue darken-2 ">
        <v-row class="ma-1">
          <span class="text-h5 white--text">Offices</span>
          <v-text-field v-model="search" label="Search" class="white--text ml-5" dense hide-details="auto"></v-text-field>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="handleClickAdd"><v-icon>mdi-plus-thick</v-icon></v-btn>
        </v-row>
      </v-card-title>

      <v-data-table :items="offices" :headers="headers" item-key="officeCode" dense class="elevation-3"
        :items-per-page="15" @click:row="handleClick" :search="search">

        <template v-slot:item.city="{ item }">
          <span class="font-weight-bold">{{ item.city }}</span>
        </template>
        <template v-slot:item.country="{ item }">
          <span class="font-weight-bold">{{ item.country }}</span>
        </template>

        <template v-slot:footer.prepend>
          <v-btn plain @click="handleClickRefresh">Refresh</v-btn>
        </template>

      </v-data-table>
    </v-card>

  </div>
</template>
  
<script>
import axios from 'axios';
import router from '@/router';

export default {
  name: 'OfficesView',
  title: 'Classic Models - Offices',
  data() {
    return {
      search: '',
      offices: [],
      endpoint: process.env.VUE_APP_BASE_URL+'/offices',
      headers: [
        { text: "Office Code", value: "officeCode", width: '5px', class: "blue lighten-5" },
        { text: "City", value: "city", width: '5px', class: "blue lighten-5" },
        { text: "Phone", value: "phone", width: '150px', class: "blue lighten-5" },
        { text: "Address Line1", value: "addressLine1", width: '150px', class: "blue lighten-5" },
        { text: "Address Line2", value: "addressLine2", width: '100px', class: "blue lighten-5" },
        { text: "State", value: "state", width: '5px', class: "blue lighten-5" },
        { text: "Country", value: "country", width: '5px', class: "blue lighten-5" },
        { text: "Postal Code", value: "postalCode", width: '5px', class: "blue lighten-5" },
        { text: "Territory", value: "territory", width: '5px', class: "blue lighten-5" },
      ],
    }
  },

  watch: {
    '$route'() {
      this.getOffices();
    }
  },

  created() {
    this.getOffices();
  },

  methods: {

    getOffices() {
      axios(this.endpoint)
        .then(response => {
          this.offices = response.data;
        })
        .catch(error => {
          console.log(error);
        })
    },

    handleClick(row) {
      console.log(row);
      router.push({ path: `/offices/${row.officeCode}` });
    },

    handleClickAdd() {
      router.push({ path: `/offices/new` });
    },

    handleClickRefresh() {
      this.getOffices();
    },

  },
}
</script>
