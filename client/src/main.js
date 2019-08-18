import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueToasted from 'vue-toasted';
import VueSocketIO from 'vue-socket.io';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Load Toast Plugin
Vue.use(VueToasted, {
  iconPack: 'fontawesome'
});

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://localhost:3000'
}));

Vue.config.productionTip = true;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
