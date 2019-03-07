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
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token') // add

// ** axios 인터셉터 : api로 보내는 axios 중간에 인터셉트한다
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log(config)
    config.headers.Authorization = localStorage.getItem('token') // add
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response)
    // if(response.data) console.log(response.data) // 받아오는 데이터를 찍어보자
    // if (response.data.token) { // 토큰 인터셉터
    //     console.log(response.data.token)
    //     // 서버에서 응답으로 받아온 토큰이 있는 경우 적용
    //     localStorage.setItem('token', response.data.token)
    //     this.$store.commit('getToken') // >>>> 문제는 얘가 안됨. axios 안에서 this.$store가 없음
    // }

    // > 토큰 재발급 처리를 여기서 한다

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

            // ** r.data.d 에 로그인한 유저정보가 담겨왔다
            // console.log(r.data.d)
            // localStorage.setItem('lsId', r.data.d.id)
            // localStorage.setItem('lsName', r.data.d.name)
            // localStorage.setItem('lsLv', r.data.d.lv)

            // 아이디,이름,레벨
            // const uId = r.data.d.id
            // const uName = r.data.d.name
            // const uLv = r.data.d.lv

            // * this.$store.state ~~ 이렇게는 접근자체가 안됨

            // use store
            // store.commit('setUserId', uId) // user id 만 저장
            // store.commit('setUserInfo', r.data.d) // 모든 유저정보 저장

            next()
        })
        .catch((e) => {
            // console.error(e.message)
            next(`/block/${e.message}`)
        })
}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'lv0',
            component: () => import('./views/lv0'),
            beforeEnter: pageCheck
        },
        {
            path: '/lv1',
            name: 'lv1',
            component: () => import('./views/lv1'),
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
            component: () => import('./views/user'),
            beforeEnter: pageCheck
        },
        {
            path: '/page',
            name: '페이지',
            component: () => import('./views/page'),
            beforeEnter: pageCheck
        },
        {
            path: '/block/:msg',
            name: '차단',
            component: () => import('./views/block')
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('./views/Test')
        },
        {
            path: '/test2',
            name: 'test2',
            component: () => import('./views/Test2')
        },
        {
            path: '/sign',
            name: '로그인',
            component: () => import('./views/sign')
        },

        {
            path: '*',
            name: 'e404',
            component: () => import('./views/e404')
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
