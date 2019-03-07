<template>
    <v-container>
        <v-alert type="info" :value="true">
            레벨 3 {{ this.$store.state.userInfo.name }}
        </v-alert>
    </v-container>
</template>

<script>
export default {
    mounted () {
        // this.uId = localStorage.getItem('uId')
        // console.log(this.$store.state.userId)
        // console.log(this.$store.state.userInfo.name)
    }
}
</script>
