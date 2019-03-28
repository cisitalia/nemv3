import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
// import Home from './views/Home.vue'

// vuex store 를 쓰기 위해서
import store from './store.js'

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

// [미들웨어 - 방화벽이자 인터셉터]
// 페이지체크가 필요한 페이지는 접근이 레벨에 따라 제한되어있다. 당연히 로그인 필요
// 해당 페이지에 접근하기 위해서는 be/routes/api/page 에 post 접근을 통해 승인받아야 한다.
// 성공하면 갈길 계속 가고, 실패가 리턴되면 /block/${msg} 로 빠진다
// headers: Authorization : token 을 적용했으므로 이제 토큰유무(로그인유무)를 따지는데도 쓰이게 된다.
const pageCheck = (to, from, next) => {
    // return next()
    // axios.post('page', { name: to.path.replace('/', '') }, { headers: { Authorization: localStorage.getItem('token') } })
    axios.post('page', { name: to.path })
        .then((r) => {
            // console.log(r.data)
            if (!r.data.success) throw new Error(r.data.msg)

            // 라우터로 넘어오는 r.data.d(유저정보)를 사용하려하였으나 에러가 많아서 포기
            // sign 으로 로그인시 유저정보를 패칭하는 것으로 정리

            next() // 가던길로 보낸다
        })
        .catch((e) => {
            // 로그인이 필요한 페이지인데 로그인이 안되어있거나 권한이 없는 경우
            // next(`/block/${e.message}`)
            next(`/block/${e.message.replace(/\//gi, ' ')}`) // '/'를 공백처리

            // * 토큰 유효기간이 끝난 경우 기존 토큰을 모두 삭제하고 로그인창으로 보낸다.
            // * 난제 : 로그인 되었고 단지 레벨이 안맞을 뿐인데도 토큰을 삭제하는 문제가 발생함.
            // * 해결 : 에러 문자열에서 '[ERR01-TOKEN] jwt expired' 이 있는지 검사한다.
            // App.vue 의 signOut() 을 흉내낸다.
            // this.$store는 안되므로 위에 import store from './store.js' 를 하고 아래처럼 store 만 해야 한다.
            if (e.message.includes('ERR01-TOKEN') || e.message.includes('jwt expired')) {
                setTimeout(() => {
                    store.commit('delToken')
                    location.href = '/sign'
                }, 800)
            }
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
            name: 'dashboard',
            component: () => import('./views/dashboard'),
            beforeEnter: pageCheck
        },
        {
            path: '/board/:name',
            name: 'board',
            component: () => import('./views/board'),
            beforeEnter: pageCheck
        },
        {
            path: '/test/lv3',
            name: 'testLv3',
            component: () => import('./views/test/lv3'),
            beforeEnter: pageCheck
        },
        {
            path: '/test/lv2',
            name: 'testLv2',
            component: () => import('./views/test/lv2'),
            beforeEnter: pageCheck
        },

        {
            path: '/test/lv1',
            name: 'testLv1',
            component: useComponent('test/lv1'),
            beforeEnter: pageCheck
        },
        {
            path: '/test/lv0',
            name: 'testLv0',
            component: useComponent('test/lv0'),
            beforeEnter: pageCheck
        },

        {
            path: '/manage/users',
            name: 'manageUsers',
            component: useComponent('manage/users'),
            beforeEnter: pageCheck
        },
        {
            path: '/manage/pages',
            name: 'managePages',
            component: useComponent('manage/pages'),
            beforeEnter: pageCheck
        },
        {
            path: '/manage/sites',
            name: 'manageSites',
            component: useComponent('manage/sites'),
            beforeEnter: pageCheck
        },
        {
            path: '/manage/boards',
            name: 'manageBoards',
            component: useComponent('manage/boards'),
            beforeEnter: pageCheck
        },
        {
            path: '/block/:msg',
            name: '차단',
            component: useComponent('block')
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
            path: '/test/:name?',
            name: 'router_test',
            component: useComponent('Test3')
        },
        {
            path: '*',
            name: 'e404',
            component: useComponent('e404')
        }
        // {
        //     path: '/test',
        //     name: 'test',
        //     component: useComponent('Test')
        // },
        // {
        //     path: '/test2',
        //     name: 'test2',
        //     component: useComponent('Test2')
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
