<template>
    <v-app :dark="siteDark">
        <v-navigation-drawer
        persistent
        v-model="drawer"
        :mini-variant.sync="mini"
        enable-resize-watcher
        fixed
        app
        >
            <!-- 로그인 & 관리자 -->
            <v-toolbar flat class="transparent" v-if="$store.state.token && this.$store.state.userInfo.id !== 'rhduddnr'">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <img src="https://randomuser.me/api/portraits/men/85.jpg">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ this.$store.state.userInfo.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <!-- 로그인 & !관리자 -->
            <v-toolbar flat class="transparent" v-else-if="$store.state.token && this.$store.state.userInfo.id === 'rhduddnr'">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-badge
                                overlap
                                color="orange"
                            >
                                <v-icon
                                    slot="badge"
                                    dark
                                    small
                                >notifications</v-icon>
                                <v-icon
                                    large
                                    color="green darken-2"
                                >
                                    account_box
                                </v-icon>
                            </v-badge>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ this.$store.state.userInfo.name }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon @click.native.stop="mini = !mini">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <!-- !로그인 & 손님 -->
            <v-toolbar flat class="transparent" v-else>
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-icon
                                large
                                color="grey darken-1"
                            >
                                sentiment_satisfied_alt
                            </v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>손님</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>

            <v-list>
                <v-list-group
                    v-for="(item, i) in items"
                    v-model="item.act"
                    :prepend-icon="item.icon"
                    :key="i"
                    no-action
                >
                    <v-list-tile slot="activator">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                        v-for="(subItem, n) in item.subItems"
                        :key="subItem.title"
                        :to="subItem.to"
                        :prepend-icon="subItem.icon"
                        @mouseover="showByIndex=n"
                        @mouseout="showByIndex=null"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action v-show="showByIndex === n">
                            <v-icon
                                @click.stop.prevent="subItem.action(i, n)"
                            >{{ subItem.icon }}</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
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
            <!-- <v-toolbar-title v-if="this.$store.state.userInfo.name">
                {{ this.$store.state.userInfo.name }}
            </v-toolbar-title> -->
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
                        <template v-else>
                            <v-list-tile @click="$router.push('/user')">
                                <v-list-tile-title>유저 정보 수정</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="signOut">
                                <v-list-tile-title>로그아웃</v-list-tile-title>
                            </v-list-tile>
                        </template>
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

        <!-- 공용 알림 메시지 -->
        <v-snackbar
            v-model="$store.state.sb.act"
            :color="$store.state.sb.color"
            top
        >
            {{ $store.state.sb.msg }}
            <v-btn
                flat
                @click="$store.commit('pop', { act: false })"
            >
                닫기
            </v-btn>
        </v-snackbar>

    </v-app>
</template>

<script>
export default {
    name: 'App',
    data () {
        return {
            showByIndex: null,
            drawer: null,
            mini: false,
            siteTitle: '기다리는 중',
            siteCopyright: '기다리는 중',
            siteDark: false,
            items: [
                {
                    icon: 'donut_large',
                    title: '현황',
                    act: true, // 로딩시 열어줌
                    subItems: [
                        {
                            // icon: 'home',
                            title: '오늘',
                            to: {
                                path: '/'
                            },
                            action: this.subAction
                        }
                    ]
                },
                {
                    icon: 'chat',
                    title: '게시판',
                    subItems: [
                        // {
                        //     icon: 'home',
                        //     title: '아무나',
                        //     to: {
                        //         path: '/board/아무나'
                        //     },
                        //     action: this.subAction
                        // },
                        // {
                        //     icon: 'home',
                        //     title: '지호',
                        //     to: {
                        //         path: '/board/지호'
                        //     },
                        //     action: this.subAction
                        // }
                    ]
                },
                {
                    icon: 'pan_tool',
                    title: '레벨테스트',
                    subItems: [
                        {
                            icon: 'home',
                            title: '손님용 페이지',
                            to: {
                                path: '/test/lv3'
                            },
                            action: (i, n) => {
                                console.log('>> ' + this.items[i].subItems[n].to.path)
                                console.log('ggggg-' + i + '- ' + n)
                            }
                        },
                        {
                            icon: 'pets',
                            title: '일반유저용 페이지',
                            to: {
                                path: '/test/lv2'
                            },
                            action: this.subAction
                        },
                        {
                            icon: 'offline_bolt',
                            title: '슈퍼유저용 페이지',
                            to: {
                                path: '/test/lv1'
                            },
                            action: this.subAction
                        },
                        {
                            icon: 'supervisor_account',
                            title: '관리자용 페이지',
                            to: {
                                path: '/test/lv0'
                            },
                            action: this.subAction
                        }
                    ]
                },
                {
                    icon: 'settings',
                    title: '관리메뉴',
                    subItems: [
                        {
                            icon: 'face',
                            title: '사용자 관리',
                            to: {
                                path: '/manage/users'
                            },
                            action: this.subAction
                        },
                        {
                            icon: 'pageview',
                            title: '페이지 관리',
                            to: {
                                path: '/manage/pages'
                            },
                            action: this.subAction
                        },
                        {
                            icon: 'settings',
                            title: '사이트 관리',
                            to: {
                                path: '/manage/sites'
                            },
                            action: this.subAction
                        },
                        {
                            icon: 'settings',
                            title: '게시판 관리',
                            to: {
                                path: '/manage/boards'
                            },
                            action: this.subAction
                        }
                    ]
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
        this.getBoards()
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
            this.$router.push('/test/lv3')
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
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        getBoards () { // 로딩시 게시판 리스트를 가져와서 메뉴를 구성한다.
            this.$axios.get('/board/list')
                .then(({ data }) => {
                    data.ds.forEach(v => {
                        this.items[1].subItems.push({
                            title: v.name,
                            to: {
                                path: `/board/${v.name}`
                            }
                        })
                    })
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        subAction (i, n) {
            console.log(`test-${i}-${n}`)
            console.log(this.items[i].subItems[n].title)
        }
    }
}
</script>

<style>
/* .v-datatable__actions__select {
    display: none;
} */
/* .v-datatable__actions__range-controls {
    display: none;
} */
</style>
