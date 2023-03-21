import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import titleMixin from './mixins/titleMixin'

Vue.mixin(titleMixin)

Vue.config.productionTip = false

export const eventBus = new Vue();

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
