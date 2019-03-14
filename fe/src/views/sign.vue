<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                v-model="form.id"
                                prepend-icon="person"
                                label="로그인"
                                type="text"
                            ></v-text-field>
                            <v-text-field
                                v-model="form.pwd"
                                prepend-icon="lock"
                                label="Password"
                                type="password"
                                @keydown="inputPwd"
                            ></v-text-field>
                        <v-checkbox
                            v-model="form.remember"
                            label="암호 기억하기(최대 7일간 보관 됩니다)"
                        ></v-checkbox>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="signIn">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-snackbar
            v-model="sb.act"
            top
        >
            {{ sb.msg }}
            <v-btn
                :color="sb.color"
                flat
                @click="sb.act = false"
            >
                닫기
            </v-btn>
        </v-snackbar>

    </v-container>
</template>

<script>
export default {
    data: () => ({
        form: {
            id: '',
            pwd: '',
            remember: false
        },
        sb: {
            act: false,
            msg: '',
            color: 'warning'
        }
    }),
    methods: {
        signIn () {
            // 로그인 아이디/비번 검사 후 토큰을 발행받는다.
            // 토큰은 localStorage 에 저장한 후 vuex(스토어)에도 저장한다
            // /header 경로로 보낸다.(후킹의 일종)
            this.$axios.post('sign/in', this.form)
                .then(r => {
                    // if (!r.data.success) return console.error(r.data.msg)
                    if (!r.data.success) throw new Error(`[서버에러]: ${r.data.msg}`)

                    // 토큰 저장
                    localStorage.setItem('token', r.data.token)
                    this.$store.commit('getToken')

                    // 유저정보 저장
                    localStorage.setItem('uId', r.data.ui.id)
                    localStorage.setItem('uName', r.data.ui.name)
                    localStorage.setItem('uLv', r.data.ui.lv)
                    this.$store.commit('getLoginUserInfo', r.data.ui)

                    // this.$router.push('/')
                    // 유저레벨에 맞는 페이지로 이동 하도록 변경
                    if (r.data.ui.lv > 0) {
                        this.$router.push(`/lv${r.data.ui.lv}`)
                    } else {
                        this.$router.push('/')
                    }

                    // this.$router.push('/header')
                    // location.href = '/header' // $router.push() 대신 이렇게 해도 된다
                })
                // .catch(e => console.error(e.message))
                .catch(e => this.pop(e.message, 'error'))
        },
        inputPwd (e) {
            if (e.keyCode === 13) {
                this.signIn()
            }
        },
        pop (m, cl) {
            this.sb.act = true
            this.sb.msg = m
            this.sb.color = cl
        }
    }
}
</script>
