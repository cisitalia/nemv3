<template>
    <v-container>
        <v-alert type="error" :value="true">
            로그인이 필요한 페이지 입니다. {{ $route.params.msg }}
        </v-alert>
    </v-container>
</template>

<script>
export default {
    mounted () {
        // console.log(this.$store.state.token)
        // this.$store.commit('getToken')
        // this.$store.commit('delToken')
    },
    methods: {
        // goSignIn () {
        //     // location.href = '../sign'
        //     this.$router.push('../sign')
        // }
    }
}
</script>
