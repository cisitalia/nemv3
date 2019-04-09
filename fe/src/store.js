import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 토큰 : 로컬스토리지에서 가져온다.
        token: localStorage.getItem('token'),
        // 로그인 유저 정보
        user: {
            // name: localStorage.getItem('uName') || '손님',
            // id: localStorage.getItem('uId') || 'guest',
            // lv: localStorage.getItem('uLv') || 3,
            // img: localStorage.getItem('uImg') || ''
            name: localStorage.getItem('uName'),
            id: localStorage.getItem('uId'),
            lv: localStorage.getItem('uLv'),
            img: localStorage.getItem('uImg')
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
        getToken (state, user) {
            // 토큰 가져오기
            state.token = localStorage.getItem('token')

            // 유저정보 가져오기
            // state.user = user
            state.user.name = localStorage.getItem('uName')
            state.user.id = localStorage.getItem('uId')
            state.user.lv = localStorage.getItem('uLv')
            state.user.img = localStorage.getItem('uImg')
        },
        // 로그아웃 처리 : 저장된 토큰을 없앤다
        delToken (state) {
            localStorage.removeItem('token')
            state.token = null

            // 유저정보 초기화
            localStorage.setItem('uName', '손님')
            localStorage.setItem('uId', 'guest')
            localStorage.setItem('uLv', 3)
            localStorage.setItem('uImg', '')
            state.user = {
                name: '손님',
                id: 'guest',
                lv: 3,
                img: ''
            }
        },
        // 공용 알림메시지(스낵바)를 변이한다 - 알림메시지를 띄운다
        pop (state, d) {
            state.sb.msg = d.msg
            state.sb.color = d.color
            state.sb.act = false
            if (d.act === undefined) state.sb.act = true
        },
        // 유저정보를 가져온다 - 갱신되는 경우 필요
        getUserInfo (state) {
            state.user.name = localStorage.getItem('uName')
            state.user.id = localStorage.getItem('uId')
            state.user.lv = localStorage.getItem('uLv')
            state.user.img = localStorage.getItem('uImg')
        }
    },
    actions: {

    }
})
