<template>
  <div class="home">  
    <v-card max-width="1000px"  >
      <v-row class="text-center">
        <v-img alt="Vue logo" contain max-height="700" max-width="1000"      
          style="opacity: 0.5;"
          src="../assets/1950-Olds-88-Holiday-Coupe.jpg">
        </v-img>
      </v-row>
      <v-container>
        <v-row class="text-center ">
          <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3">
              Welcome to Classic Models
            </h1>
          </v-col>
        </v-row>
      </v-container>
    </v-card>  

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
}
</script>
