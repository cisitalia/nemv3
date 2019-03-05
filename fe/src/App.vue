<template>
    <v-app :dark="dark">
        <v-navigation-drawer
        persistent
        v-model="drawer"
        enable-resize-watcher
        fixed
        app
        >
            <v-list>
                <v-list-tile
                value="true"
                v-for="(item, i) in items"
                :key="i"
                :to="item.to"
                >
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar
        app
        >
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-btn
                icon
                @click="dark = !dark"
            >
                <v-icon>loop</v-icon>
            </v-btn>
            <v-toolbar-title v-text="title"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-menu bottom left>
                    <v-btn icon slot="activator">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="$router.push('/')">
                            <v-list-tile-title>홈</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-if="!$store.state.token" @click="$router.push('sign')">
                            <v-list-tile-title>로그인</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-else @click="signOut">
                            <v-list-tile-title>로그아웃</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>

        <v-content>
            <router-view/>
        </v-content>

        <v-footer fixed app>
            <span>&copy; 2017 {{ $store.state.token }} </span>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
            drawer: null,
            dark: false,
            items: [
                {
                    icon: 'home',
                    title: 'Sweet Home',
                    to: {
                        path: '/'
                    }
                },
                {
                    icon: 'face',
                    title: '사용자 관리',
                    to: {
                        path: '/user'
                    }
                },
                {
                    icon: 'face',
                    title: 'header',
                    to: {
                        path: '/header'
                    }
                },
                {
                    icon: 'live_help',
                    title: '테스트',
                    to: {
                        path: '/test'
                    }
                },
                {
                    icon: 'image',
                    title: '테스트2',
                    to: {
                        path: '/test2'
                    }
                }
            ],
            title: `Vuetify.js - ${this.$apiRootPath}`
        }
    },
    methods: {
        signOut () {
            // localStorage.removeItem('token')
            this.$store.commit('delToken')
            this.$router.push('/')
        }
    }
}
</script>
