import Vue from 'vue'
// import ko from 'vee-validate/dist/locale/ko'
// import VeeValidate, { Validator } from 'vee-validate'
import VeeValidate from 'vee-validate'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

// use moment
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
moment.locale('ko') // 한글화

Vue.config.productionTip = false

Vue.use(VeeValidate)
Vue.use(VueMomentJS, moment)

// Validator.localize('ko', ko)

// router.js 로 옮김
// Vue.prototype.$apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
