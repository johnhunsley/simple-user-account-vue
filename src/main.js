import Vue from 'vue'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Users from './components/Users.vue';
import Login from './components/Login.vue';
import auth from './auth'

Vue.use(VueResource);
Vue.use(VueRouter);

function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    console.log('not logged in, forwarding to /login');
    next({
      path: '/login'
    })
  } else {
    console.log('logged in, forwarding to next()');
    next()
  }
}

export var router = new VueRouter({
  mode: 'history',
  routes : [
    {path: '/', redirect: '/users'},
    {path: '/users', component: Users, beforeEnter: requireAuth},
    {path: '/login', component: Login}
  ]
});

var app = new Vue({
  el: '#app',
  router
})

