import Vue from 'vue'
import VueResource from 'vue-resource';
import Pager from './Pager.vue'

Vue.use(VueResource);

new Vue({
  el: '#pager',
  render: h => h(Pager)
})
