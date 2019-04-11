import Vue from 'vue'
import VeeValidate from 'vee-validate'
import LoadScript from 'vue-plugin-load-script'
import VueRecaptcha from 'vue-recaptcha'
import VueAnalytics from 'vue-analytics'
import Trend from 'vuetrend' // v-sparkline 이 나와서 필요없다
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

// import toast vue editor plugins & component
import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import { Editor, Viewer } from '@toast-ui/vue-editor'

import cfg from '../config' // load conifg(/fe/config/index.js)

// use moment
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
moment.locale('ko') // 한글화

Vue.config.productionTip = false

Vue.prototype.$cfg = cfg // registe global cfg

// ssl 붙인 후 제대로 동작함 - 실서버에선 https 로 들어가게
// fe/config/index.js 의 httpsOnly 를 true 로 변경해야 함.
if (process.env.NODE_ENV === 'production' && location.protocol === 'http:' && cfg.httpsOnly) location.replace(`https://${location.hostname}`)

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
Vue.use(Trend)

// vue-plugin-load-script 플러그인을 사용한 동적 로딩
Vue.loadScript('https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
    .then(() => {
        Vue.component('vue-recaptcha', VueRecaptcha) // 구글 리캡챠 컴포넌트를 전역 컴포넌트로 등록
    })
    .catch((e) => {
        console.error(`google api load failed: ${e.message}`)
    })

// regist toast editor & viewer components
// 토스트 에디터와 뷰어를 전역 컴포넌트로 등록한다!
Vue.component('editor', Editor)
Vue.component('viewer', Viewer)

// Validator.localize('ko', ko)

// router.js 로 옮김
// Vue.prototype.$apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
