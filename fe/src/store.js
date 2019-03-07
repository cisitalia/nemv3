import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token'),
        // 로그인 유저 정보
        userInfo: {
            id: localStorage.getItem('uId'),
            name: localStorage.getItem('uName'),
            lv: localStorage.getItem('uLv')
        }
    },
    mutations: {
        getToken (state) {
            state.token = localStorage.getItem('token')
        },
        delToken (state) {
            localStorage.removeItem('token')
            state.token = null

            // 추가 : 로그인 유저정보 삭제
            localStorage.removeItem('uId')
            localStorage.removeItem('uName')
            localStorage.removeItem('uLv')
            state.userInfo.id = ''
            state.userInfo.name = ''
            state.userInfo.lv = ''
        },
        getLoginUserInfo (state, ui) {
            state.userInfo.id = localStorage.getItem('uId')
            state.userInfo.name = localStorage.getItem('uName')
            state.userInfo.lv = localStorage.getItem('uLv')
        }
    },
    actions: {

    }
})
