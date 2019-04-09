import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
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
// * api에서 오는 응답(response)을 가로챈다.
axios.interceptors.response.use(
    function (response) {
        // > 토큰을 재발급받으면 여기서 가로챈 후 로컬스토리지에 저장한다.
        const token = response.data.token
        if (token) localStorage.setItem('token', token)
        return response
    },
    function (error) {
        // * 서버에서 던져주는 HTTP 공용에러 처리 추가
        // console.log(error) // 자세한 내용을 알기 힘들다
        // console.log(error.response) // error.response.data.msg 에 에러메시지가 담겨온다, error.response.status에 상태가 있다
        switch (error.response.status) {
        case 400:
            // store.commit('pop', { msg: `잘못된 요청입니다(${error.response.status}:${error.response.data.msg})`, color: 'error' })
            store.commit('pop', { msg: `잘못된 요청입니다(${error.response.data.msg}:${error.message})`, color: 'error' })
            break
        case 401:
            store.commit('delToken')
            store.commit('pop', { msg: `인증 오류입니다(${error.response.data.msg}:${error.message})`, color: 'error' })
            break
        case 403:
            store.commit('pop', { msg: `이용 권한이 없습니다(${error.response.data.msg}:${error.message})`, color: 'warning' })
            break
        default:
            store.commit('pop', { msg: `알수 없는 오류입니다(${error.response.data.msg}:${error.message})`, color: 'error' })
            break
        }
        return Promise.reject(error)
    }
)
// ** axios 인터셉터 끝

// [프론트 미들웨어 - 방화벽이자 인터셉터]
// 페이지체크가 필요한 페이지는 접근이 레벨에 따라 제한되어있다. 당연히 로그인 필요
// 해당 페이지에 접근하기 위해서는 be/routes/api/page 에 post 접근을 통해 승인받아야 한다.
// 성공하면 갈길 계속 가고, {폐지::실패가 리턴되면 /block/${msg} 로 빠진다}
// headers: Authorization : token 을 적용했으므로 이제 토큰유무(로그인유무)를 따지는데도 쓰이게 된다.
const pageCheck = (to, from, next) => {
    axios.post('page', { name: to.path })
        .then((r) => {
            if (!r.data.success) throw new Error(r.data.msg)
            next() // 가던길로 보낸다
        })
        .catch((e) => {
            // next(`/block/${e.message.replace(/\//gi, ' ')}`) // 블로킹 페이지로 가던것을 막았다...
            if (!e.response) store.commit('pop', { msg: e.message, color: 'warning' })
            next(false) // 이제 못가게 막는걸로 변경되었다.

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
        // * 동적 라우팅시 pageChaeck 가 안걸린다.
        // fe/src/views/board/index.vue 에서 걸어준다.
        {
            path: '/board/:name',
            name: 'board',
            component: () => import('./views/board')
            // beforeEnter: pageCheck
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
        { // 유저정보 수정
            path: '/user',
            name: 'user',
            component: useComponent('user'),
            beforeEnter: pageCheck
        },

        // {
        //     path: '/block/:msg',
        //     name: '차단',
        //     component: useComponent('block')
        // },
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
        // }
    ]
})
