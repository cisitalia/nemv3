import Vue from 'vue'
// import ko from 'vee-validate/dist/locale/ko'
// import VeeValidate, { Validator } from 'vee-validate'
import VeeValidate from 'vee-validate'
import LoadScript from 'vue-plugin-load-script'
import VueRecaptcha from 'vue-recaptcha'
import VueAnalytics from 'vue-analytics'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import cfg from '../config' // load conifg(/fe/config/index.js)

// use moment
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
moment.locale('ko') // 한글화

Vue.config.productionTip = false

Vue.prototype.$cfg = cfg // registe global cfg

Vue.use(VeeValidate)
Vue.use(VueMomentJS, moment)
Vue.use(LoadScript)
Vue.use(VueAnalytics, {
    id: cfg.analyticsID,
    router,
    autoTracking: {
        pageviewOnLoad: false
    }
})
// console.log(cfg)

// Vue.component('vue-recaptcha', VueRecaptcha) // 구글 리캡챠 컴포넌트를 전역 컴포넌트로 등록

// vue-plugin-load-script 플러그인을 사용한 동적 로딩
Vue.loadScript('https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
    .then(() => {
        Vue.component('vue-recaptcha', VueRecaptcha) // 구글 리캡챠 컴포넌트를 전역 컴포넌트로 등록
    })
    .catch((e) => {
        console.error(`google api load failed: ${e.message}`)
    })

// Validator.localize('ko', ko)

// router.js 로 옮김
// Vue.prototype.$apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
