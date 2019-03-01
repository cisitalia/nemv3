<template>
    <v-container>
        <v-btn @click="apiWithToken">토큰과 함께 전송</v-btn>
        <v-btn @click="apiWithTrash">이상한 문자와 함께 전송</v-btn>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    mounted () {
        // if (window.localStorage) {
        //     console.log(localStorage)
        // }
    },
    methods: {
        apiWithToken () {
            const token = localStorage.getItem('token')
            // 헤더의 Authorization 에 토큰을 실어 보낸다.
            axios.get(`${this.$apiRootPath}test`, { headers: { Authorization: token } })
                .then(r => console.log(r.data))
                .catch(e => console.log(e.message))
        },
        apiWithTrash () {
            axios.get(`${this.$apiRootPath}test`, { headers: { Authorization: 'abcdefghijk' } })
                .then(r => console.log(r.data))
                .catch(e => console.log(e.message))
        }
    }
}
</script>
