import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
// import Home from './views/Home.vue'

// vuex store 를 쓰기 위해서
// import store from './store.js'

Vue.use(Router)

Vue.prototype.$axios = axios
const apiRootPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api/' : '/api/'
Vue.prototype.$apiRootPath = apiRootPath

// axios 공용 권한 설정 - 단 한번 저장된다.(동적변경이 필요 - 인터셉터)
axios.defaults.baseURL = apiRootPath // add
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token') // add - 토큰지정(갱신이 안되서 주석)

// ** axios 인터셉터 : api로 보내는 axios 중간에 인터셉트한다
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log(config)
    config.headers.Authorization = localStorage.getItem('token') // add - 토큰 발급 및 갱신
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response)

    // > 토큰을 재발급받으면 여기서 가로챈 후 로컬스토리지에 저장한다.
    const token = response.data.token
    // console.log(token)
    if (token) localStorage.setItem('token', token)
    return response
}, function (error) {
    // Do something with response error
    return Promise.reject(error)
})
// ** axios 인터셉터 끝

// 페이지체크가 필요한 페이지는 접근이 레벨에 따라 제한되어있다.
// 해당 페이지에 접근하기 위해서는 api/page 에 post 접근을 통해 승인받아야 한다.
// 성공하면 갈길 계속 가고, 실패가 리턴되면 /block/${msg} 로 빠진다
const pageCheck = (to, from, next) => {
    // return next()
    axios.post(`${apiRootPath}page`, { name: to.path.replace('/', '') }, { headers: { Authorization: localStorage.getItem('token') } })
        .then((r) => {
            if (!r.data.success) throw new Error(r.data.msg)

            // 라우터로 넘어오는 r.data.d(유저정보)를 사용하려하였으나 에러가 많아서 포기
            // sign 으로 로그인시 유저정보를 패칭하는 것으로 정리

            next()
        })
        .catch((e) => {
            // console.error(e.message)
            next(`/block/${e.message}`)
        })
}

// 해당 컴포넌트로 이동시키는 메소드 (https://codesandbox.io/s/y3504yr0l1?from-embed)
const useComponent = component => () => import(`./views/${component}.vue`)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'lv0',
            component: useComponent('lv0'),
            beforeEnter: pageCheck
        },
        {
            path: '/lv1',
            name: 'lv1',
            component: useComponent('lv1'),
            beforeEnter: pageCheck
        },
        {
            path: '/lv2',
            name: 'lv2',
            component: () => import('./views/lv2'),
            beforeEnter: pageCheck
        },
        {
            path: '/lv3',
            name: 'lv3',
            component: () => import('./views/lv3'),
            beforeEnter: pageCheck
        },
        {
            path: '/user',
            name: '사용자',
            component: useComponent('user'),
            beforeEnter: pageCheck
        },
        {
            path: '/page',
            name: '페이지',
            component: useComponent('page'),
            beforeEnter: pageCheck
        },
        {
            path: '/site',
            name: '사이트',
            component: useComponent('site'),
            beforeEnter: pageCheck
        },
        {
            path: '/block/:msg',
            name: '차단',
            component: useComponent('block')
        },
        {
            path: '/test',
            name: 'test',
            component: useComponent('Test')
        },
        {
            path: '/test2',
            name: 'test2',
            component: useComponent('Test2')
        },
        {
            path: '/sign',
            name: '로그인',
            component: useComponent('sign')
        },
        {
            path: '/register',
            name: '회원가입',
            component: useComponent('register')
        },
        {
            path: '*',
            name: 'e404',
            component: useComponent('e404')
        }
        // {
        //     path: '/',
        //     name: 'home',
        //     component: Home
        // },
        // {
        //     path: '/header',
        //     name: '헤더',
        //     component: () => import('./views/header'),
        //     // beforeEnter: authCheck - 로그인이 필요한 서비스가 된다.
        //     beforeEnter: (to, from, next) => {
        //         // console.log(to)
        //         // console.log(from)
        //         if (!localStorage.getItem('token')) return next('block')
        //         next()
        //     }
        // },
    ]
})
