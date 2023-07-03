<template>
  <div class="home">
    <v-card max-width="1000px">
      <v-row class="text-center">
        <v-img alt="Vue logo" contain max-height="700" max-width="1000" style="opacity: 0.5;"
          src="../assets/1950-Olds-88-Holiday-Coupe.jpg">
        </v-img>
      </v-row>
      <v-container>
        <v-row class="text-center">
          <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3" id="header">
              Welcome to Classic Models
            </h1>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <span>Backend URL: {{this.base_url}}</span>
        </v-row>
        <v-row class="text-center">
          <span>Swagger: </span> <a :href="this.swagger_url"> {{this.swagger_url}} </a>
        </v-row>
      </v-container>
    </v-card>

  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'HomeView',
  title: 'Classic Models - Home',
  base_url: 'undefined',
  swagger_url: 'undefined',

  created() {
    document.title = 'Classic Models';
    this.base_url = process.env.VUE_APP_BASE_URL;
    this.swagger_url = process.env.VUE_APP_BASE_URL;
    if( typeof this.swagger_url === 'string' && this.swagger_url.length > 0 && this.swagger_url.toLowerCase().endsWith("/api")) {
      this.swagger_url = this.swagger_url.replace(/\/api$/, "/swagger-ui/index.html");
    }
    //this.huhu = 'test2';
  },

}
</script>
