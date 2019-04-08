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
    }
}
</script>
