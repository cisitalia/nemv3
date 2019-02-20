<template>
    <v-container>
        <v-alert type="warning" :value="true">
            {{ $route.path }} 404 Not Found
        </v-alert>
    </v-container>
</template>
