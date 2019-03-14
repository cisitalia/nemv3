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
            <v-toolbar-title v-if="this.$store.state.userInfo.name">
                {{ this.$store.state.userInfo.name }}
            </v-toolbar-title>
            <v-toolbar-title>
                [{{ this.$moment().format('YYYY.MM.DD') }} {{ this.$moment.weekdays(this.$moment().day()) }} 입니다.]
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
                        <template v-if="!$store.state.token">
                            <!-- <v-list-tile @click="$router.push('/sign')"> -->
                            <v-list-tile @click="signIn">
                                <v-list-tile-title>로그인</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="register">
                                <v-list-tile-title>회원가입</v-list-tile-title>
                            </v-list-tile>
                        </template>
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
            <span>{{siteCopyright}}</span>
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
                    title: '손님용 페이지',
                    to: {
                        path: '/lv3'
                    }
                },
                {
                    icon: 'pets',
                    title: '일반유저용 페이지',
                    to: {
                        path: '/lv2'
                    }
                },
                {
                    icon: 'offline_bolt',
                    title: '슈퍼유저용 페이지',
                    to: {
                        path: '/lv1'
                    }
                },
                {
                    icon: 'supervisor_account',
                    title: '관리자용 페이지',
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
                    icon: 'bookmarks',
                    title: '페이지 관리',
                    to: {
                        path: '/page'
                    }
                },
                {
                    icon: 'settings',
                    title: '사이트 관리',
                    to: {
                        path: '/site'
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
    created () {
        // this.getSite() // mounted() 와 똑같네
    },
    mounted () { // 로딩시 axios 를 통하기 때문에 번쩍거리는 단점이 있다.
        this.getSite()
        this.drawer = true
    },
    methods: {
        signIn () {
            this.$router.push('/sign')
            this.drawer = false
        },
        register () {
            this.$router.push('/register')
            this.drawer = false
        },
        signOut () { // 로그아웃시 동작
            // localStorage.clear() // localStorage 를 모두 삭제
            // localStorage.removeItem('uId')
            // localStorage.removeItem('token')

            this.$store.commit('delToken')
            this.$router.push('/lv3')
        },
        getSite () { // 초기에 사이트 정보를 가져온다.
            // routes.js 에서 axios 공통 설정해놨다
            this.$axios.get('/site')
                .then(r => {
                    // console.log(r.data.d)
                    this.siteTitle = r.data.d.title
                    this.siteCopyright = r.data.d.copyright
                    this.siteDark = r.data.d.dark
                })
                .catch(e => console.error(e.message))
        }
    }
}
</script>
