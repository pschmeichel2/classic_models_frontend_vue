import Vue from 'vue';
import VueRouter from 'vue-router';
import VueApexCharts from 'vue-apexcharts';

import HomeView from '../views/HomeView.vue';

import CustomersView from '../views/ListViews/CustomersView.vue';
import EmployeesView from '../views/ListViews/EmployeesView.vue';
import OfficesView from '../views/ListViews/OfficesView.vue';
import OrderDetailsView from '../views/ListViews/OrderDetailsView.vue';
import OrdersView from '../views/ListViews/OrdersView.vue';
import PaymentsView from '../views/ListViews/PaymentsView.vue';
import ProductsView from '../views/ListViews/ProductsView.vue';
import ProductLinesView from '../views/ListViews/ProductLinesView.vue';

import CustomerView from '../views/DetailViews/CustomerView.vue';
import EmployeeView from '../views/DetailViews/EmployeeView.vue';
import OfficeView from '../views/DetailViews/OfficeView.vue';
import OrderDetailView from '../views/DetailViews/OrderDetailView.vue';
import OrderView from '../views/DetailViews/OrderView.vue';
import PaymentView from '../views/DetailViews/PaymentView.vue';
import ProductView from '../views/DetailViews/ProductView.vue';
import ProductLineView from '../views/DetailViews/ProductLineView.vue';

import OfficeEditView from '../views/EditViews/OfficeEditView.vue';
import OrderEditView from '../views/EditViews/OrderEditView.vue';

import AlertBox from '../components/AlertBox.vue';

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: HomeView },

  { path: '/customers', name: 'customers', component: CustomersView },
  { path: '/employees', name: 'employees', component: EmployeesView },
  { path: '/orderDetails', name: 'orderDetails', component: OrderDetailsView },
  { path: '/payments', name: 'payments', component: PaymentsView },
  { path: '/products', name: 'products', component: ProductsView },
  { path: '/productLines', name: 'productLines', component: ProductLinesView },

  { path: '/customers/:customerNumber', name: 'customerView', component: CustomerView, props: true },
  { path: '/employees/:employeeNumber', name: 'employeeView', component: EmployeeView, props: true },
  { path: '/orderDetails/:orderNumber/:productCode', name: 'orderDetailView', component: OrderDetailView, props: true },
  { path: '/payments/:customerNumber/:checkNumber', name: 'paymentView', component: PaymentView, props: true },
  { path: '/products/:productCode', name: 'productView', component: ProductView, props: true },
  { path: '/productLines/:productLine', name: 'productLineView', component: ProductLineView, props: true },

  { path: '/orders', name: 'orders', component: OrdersView },
  { path: '/orders/new', name: 'orderNewView', component: OrderEditView, props: true },
  { path: '/orders/:orderNumber(\\d+)/edit', name: 'orderEditView', component: OrderEditView, props: true },
  { path: '/orders/:orderNumber(\\d+)', name: 'orderView', component: OrderView, props: true },

  { path: '/offices', name: 'offices', component: OfficesView },
  { path: '/offices/new', name: 'officeNewView', component: OfficeEditView, props: true },
  { path: '/offices/:officeCode(\\d+)/edit', name: 'officeEditView', component: OfficeEditView, props: true },
  { path: '/offices/:officeCode(\\d+)', name: 'officeView', component: OfficeView, props: true },
  /*
  {
    path: '/offices',
    component: OfficesView,
    children: [
      {
        path: '/new', 
        component: OfficeEditView,
        props: true
      },
      {
        path: ':officeCode/edit',
        component: OfficeEditView,
        props: true
      },
      {
        path: ':officeCode',
        component: OfficeView,
        props: true
      },
    ]
  },
  */

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
