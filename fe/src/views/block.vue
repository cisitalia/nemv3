<template>
    <v-container>
        <v-alert type="error" :value="true">
            <p>로그인이 필요한 페이지 입니다.</p>
            <v-spacer></v-spacer>
            <v-btn flat color="gray lighten-2" @click="$router.push('sign')">로그인</v-btn>
        </v-alert>
    </v-container>
</template>

<script>
export default {
    mounted () {
        // console.log(this.$store.state.token)
        // this.$store.commit('getToken')
        // this.$store.commit('delToken')
    }
}
</script>
