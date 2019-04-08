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
                                @keydown.enter="signIn"
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

    </v-container>
</template>

<script>
export default {
    data: () => ({
        form: {
            id: '',
            pwd: '',
            remember: false
        }
    }),
    methods: {
        signIn () {
            // 로그인 아이디/비번 검사 후 토큰을 발행받는다.
            // 토큰은 localStorage 에 저장한 후 vuex(스토어)에도 저장한다
            // /header 경로로 보낸다.(후킹의 일종)
            this.$axios.post('sign/in', this.form)
                .then(r => {
                    if (!r.data.success) throw new Error(`[서버에러]: ${r.data.msg}`)

                    // 로컬스토리지에 토큰 저장
                    localStorage.setItem('token', r.data.token)

                    // 로컬스코리지에 로그인 사용자 정보 저장
                    localStorage.setItem('uName', r.data.user.name)
                    localStorage.setItem('uId', r.data.user.id)
                    localStorage.setItem('uLv', r.data.user.lv)
                    localStorage.setItem('uImg', r.data.user.img)

                    // * vuex에 토큰과 로그인 사용자 정보 변이 시킴
                    this.$store.commit('getToken', r.data.user)

                    // this.$router.push('/')
                    // 유저레벨에 맞는 페이지로 이동 하도록 변경
                    // this.$router.push(`/test/lv${r.data.ui.lv}`)
                    this.$router.push(`/test/lv${r.data.user.lv}`)
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        }
    }
}
</script>
