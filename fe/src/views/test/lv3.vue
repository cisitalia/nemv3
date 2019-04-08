<template>
    <v-container>
        <v-alert type="info" :value="true">
            레벨 3 손님용 페이지
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
