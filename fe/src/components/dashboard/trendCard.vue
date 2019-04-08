<template>
    <v-card height="100%">
        <v-card-title primary-title>
            <span class="grey--text">{{title}}</span>
        </v-card-title>
        <v-card-text>
            <!-- <trend :data="data" :gradient="gradient" auto-draw smooth></trend> -->
            <v-sparkline :value="data" line-width="2" :gradient="gradient" auto-draw smooth></v-sparkline>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: ['title', 'data', 'gradient']
}
</script>
