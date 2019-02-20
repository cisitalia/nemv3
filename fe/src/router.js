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
            component: () => import(/* webpackChunkName: "about" */ './views/User.vue')
        },
        {
            path: '/test',
            name: 'test',
            component: () => import('./views/Test.vue')
        },
        {
            path: '/test2',
            name: 'test2',
            component: () => import('./views/Test2.vue')
        },
        {
            path: '*',
            name: 'e404',
            component: () => import('./views/e404.vue')
        }
    ]
})
