// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'

import { mount } from 'cypress/vue2';
import Vue from 'vue';

import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import VApp from 'vuetify/lib/components/VApp';
import router from '../../src/router/index';
import App from '../../src/App';


Vue.use(Vuetify);
Vue.use(VueRouter);


Cypress.Commands.add('mount', (component, options = {}) => {
  options.vuetify = new Vuetify();
  options.router = new VueRouter();
  options.extensions = options.extensions || {};
  options.extensions.components = options.extensions.components || {};
    
  options.extensions.components['App'] = App;    
  return mount({ render: (h) => h(VApp, [h(component, options)]) }, options);    
})

