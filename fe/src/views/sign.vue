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
                            <v-text-field prepend-icon="person" v-model="form.id" label="Login" type="text"></v-text-field>
                            <v-text-field prepend-icon="lock" v-model="form.pwd" label="Password" type="password"></v-text-field>
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
import axios from 'axios'

export default {
    data: () => ({
        form: { id: '', pwd: '' }
    }),
    methods: {
        signIn () {
            // 로그인 아이디/비번 검사 후 토큰을 발행받는다.
            // 토큰은 localStorage 에 저장한 후 vuex(스토어)에도 저장한다
            // /header 경로로 보낸다.(후킹의 일종)
            axios.post(`${this.$apiRootPath}sign/in`, this.form)
                .then(r => {
                    if (!r.data.success) return console.error(r.data.msg)
                    localStorage.setItem('token', r.data.token)
                    this.$store.commit('getToken')
                    this.$router.push('/')

                    // this.$router.push('/header')
                    // location.href = '/header' // $router.push() 대신 이렇게 해도 된다
                })
                .catch(e => console.error(e.message))
        }
    }
}
</script>
