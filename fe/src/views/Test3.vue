<template>
    <v-container>
        <v-card class="mx-auto">
            <v-card-title class="headline mb-0">router test</v-card-title>
            <v-card-text>
                <h3>name: {{ username }}</h3>
                <br><br>
                <div><router-link to="/test/foo">/test/foo</router-link></div><br>
                <div><router-link to="/test/bar">/test/bar</router-link></div><br>
                <div><router-link to="/test/">nobody send</router-link></div><br>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        username: ''
    }),
    watch: {
        '$route' (to, from) {
            // console.log(to)

            // location.href = to.path // [정상] 리로딩

            // 필요한 부분만 업데이트
            this.$router.push(to.path)
            this.username = this.$route.params.name || 'No username'
        }
    },
    mounted () {
        // const { name } = this.$route.params // 이렇게 받아도 되고
        // console.log(name)

        this.username = this.$route.params.name || 'No username'
        // this.postId = this.$route.params.post_id || 'post id is not valid'
    }
}
</script>
