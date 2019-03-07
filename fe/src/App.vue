<template>
    <v-app :dark="siteDark">
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
            <!-- <v-btn
                icon
                @click="siteDark = !siteDark"
            >
                <v-icon>loop</v-icon>
            </v-btn> -->
            <v-toolbar-title v-text="siteTitle"></v-toolbar-title>
            <v-toolbar-title>
            {{ this.$store.state.userInfo.name }}
            </v-toolbar-title>
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
                        <v-list-tile v-if="!$store.state.token" @click="$router.push('/sign')">
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
            <span>&copy; 2017 {{siteCopyright}} </span>
        </v-footer>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
            drawer: null,
            siteTitle: '기다리는 중',
            siteCopyright: '기다리는 중',
            siteDark: false,
            items: [
                {
                    icon: 'home',
                    title: 'lv0',
                    to: {
                        path: '/'
                    }
                },
                {
                    icon: 'home',
                    title: 'lv1',
                    to: {
                        path: '/lv1'
                    }
                },
                {
                    icon: 'home',
                    title: 'lv2',
                    to: {
                        path: '/lv2'
                    }
                },
                {
                    icon: 'home',
                    title: 'lv3',
                    to: {
                        path: '/lv3'
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
                    title: '페이지 관리',
                    to: {
                        path: '/page'
                    }
                }
                // {
                //     icon: 'face',
                //     title: 'header',
                //     to: {
                //         path: '/header'
                //     }
                // },
                // {
                //     icon: 'live_help',
                //     title: '테스트',
                //     to: {
                //         path: '/test'
                //     }
                // },
                // {
                //     icon: 'image',
                //     title: '테스트2',
                //     to: {
                //         path: '/test2'
                //     }
                // }
            ]
        }
    },
    mounted () {
        this.getSite()
    },
    methods: {
        signOut () {
            // localStorage.clear() // localStorage 를 모두 삭제
            // localStorage.removeItem('uId')
            // localStorage.removeItem('token')

            this.$store.commit('delToken')
            this.$router.push('/')
        },
        getSite () {
            // routes.js 에서 axios 공통 설정해놨다
            this.$axios.get('/site')
                .then(r => {
                    cosnole.log(r.data.d)
                    this.siteTitle = r.data.d.title
                    this.siteCopyright = r.data.d.copyright
                    this.siteDark = r.data.d.dark
                })
                .catch(e => console.error(e.message))
        }
    }
}
</script>
