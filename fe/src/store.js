import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 토큰 : 로컬스토리지에서 가져온다.
        token: localStorage.getItem('token'),
        // 로그인 유저 정보
        userInfo: {
            id: localStorage.getItem('uId'),
            name: localStorage.getItem('uName'),
            lv: localStorage.getItem('uLv')
        },
        // 공용 알림 메시지(스낵바)
        sb: {
            act: false,
            msg: '',
            color: 'error'
        }
    },
    mutations: {
        // 로컬 스토리지에서 토큰을 가져와서 저장한다.
        getToken (state) {
            state.token = localStorage.getItem('token')
        },
        // 로그아웃 처리 : 저장된 토큰을 없앤다
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
        // 로그인한 유저의 기본 정보를 저장한다 : 로컬스토리지에서 가져온다
        getLoginUserInfo (state, ui) {
            state.userInfo.id = localStorage.getItem('uId')
            state.userInfo.name = localStorage.getItem('uName')
            state.userInfo.lv = localStorage.getItem('uLv')
        },
        // 공용 알림메시지(스낵바)를 변이한다 - 알림메시지를 띄운다
        pop (state, d) {
            state.sb.msg = d.msg
            state.sb.color = d.color
            state.sb.act = false
            if (d.act === undefined) state.sb.act = true
        }
    },
    actions: {

    }
})
