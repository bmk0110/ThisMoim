import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import {store} from './store'
import cookies from 'vue-cookie';
import constant from './lib/constants'
import vuetify from './plugins/vuetify';
import io from 'socket.io-client'; 

//const socket = io('http://localhost:3030');
const socket = io('http://i3a510.p.ssafy.io:3030');

Vue.prototype.$socket = socket;
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  vuetify,
  template: '<App/>'
})
