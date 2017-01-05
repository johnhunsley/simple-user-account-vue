import Vue from 'vue'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Pager from './Pager.vue';
import Login from './Login.vue';

Vue.use(VueResource);
Vue.use(VueRouter);

export var router = new VueRouter({
  routes : [
    {path: '/', component: Pager},
    {path: '/login', component: Login}
  ]
});

var app = new Vue({
  router
}).$mount('#app')

