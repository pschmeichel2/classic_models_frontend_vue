<template>
  <div id="app">
    <v-app>
    <v-navigation-drawer v-model="drawer" app>

      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64">
          <v-img                  
              alt="Avatar"
              :src="require('@/assets/Leslie_Thomson.jpg')"
                ></v-img>
          <!--<v-icon dark>mdi-account-circle</v-icon>-->
        </v-avatar>
        <div>Leslie Thompson</div>
      </v-sheet>

      <v-divider></v-divider>
      <v-card class="mx-auto" max-width="500">
      <v-list>
        <v-list-item v-for="[to, text, icon] in links" :key="to" link  :to="to">
          <v-list-item-icon>
              <v-icon>{{icon}}</v-icon>
          </v-list-item-icon> 
          <v-list-item-content>{{ text }}</v-list-item-content>            
        </v-list-item>
      </v-list>
      </v-card>
    </v-navigation-drawer>
    
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Classic Models</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    </v-app>    
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
  export default {
    data: () => ({ 
      drawer: null,
      links: [
        ['/', 'Home', 'mdi-home'],
        ['/offices', 'Offices', 'mdi-office-building'],        
        ['/employees', 'Employees', 'mdi-account-tie'],    
        ['/customers', 'Customers', 'mdi-account'],
        ['/orders', 'Orders', 'mdi-cart-outline'],                               
        ['/orderDetails', 'Order Details', 'mdi-send'],                        
        ['/payments', 'Payments', 'mdi-credit-card-multiple-outline'],                
        ['/productLines', 'Product Lines', 'mdi-multicast'],        
        ['/products', 'Products', 'mdi-taxi'],        
        
      ],
     }),
  }
</script>