<template>
    <v-container>
        <v-alert type="success" :value="true">
            레벨 2 일반유저용 페이지
        </v-alert>
        <HelloWorld />
    </v-container>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'

export default {
    components: {
        HelloWorld
    },
    mounted () {
        // this.uId = localStorage.getItem('uId')
        // console.log(this.$store.state.userId)
        // console.log(this.$store.state.userInfo.name)
    }
}
</script>
