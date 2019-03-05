import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/user',
            name: 'user',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/User')
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
            path: '/header',
            name: '헤더',
            component: () => import('./views/header'),
            // beforeEnter: authCheck - 로그인이 필요한 서비스가 된다.
            beforeEnter: (to, from, next) => {
                // console.log(to)
                // console.log(from)
                if (!localStorage.getItem('token')) return next('block')
                next()
            }
        },
        {
            path: '/sign',
            name: '로그인',
            component: () => import('./views/sign')
        },
        {
            path: '/block',
            name: '차단',
            component: () => import('./views/block')
        },
        {
            path: '*',
            name: 'e404',
            component: () => import('./views/e404')
        }
    ]
})
