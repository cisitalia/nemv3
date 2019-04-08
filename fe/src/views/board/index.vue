<template>
    <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs" :class="$vuetify.breakpoint.xs ? 'pa-0' : ''">
        <v-layout row wrap>
            <v-flex xs12>
                <v-card class="elevation-1">
                    <v-card-title class="headline">
                        <v-tooltip bottom>
                            <span slot="activator">{{board.name}}</span>
                            <span>{{board.rmk}}</span>
                        </v-tooltip>
                        <v-spacer></v-spacer>
                        <div style="width: 300px">
                            <v-text-field
                                label="검색"
                                append-icon="search"
                                v-model="params.search"
                                clearable
                            ></v-text-field>
                        </div>
                        <v-spacer></v-spacer>
                        <div style="width: 100px">
                            <v-select
                                :items="rowsPerPageItems"
                                v-model="pagination.rowsPerPage"
                                label="검색건수"
                            ></v-select>
                        </div>
                        <v-chip outline color="grey darken-3">
                            <v-icon left>list_alt</v-icon>{{pagination.totalItems}}건
                        </v-chip>
                    </v-card-title>
                </v-card>
            </v-flex>

            <v-flex xs12>
                <v-data-table
                    :headers="headers"
                    :items="articles"
                    :total-items="pagination.totalItems"
                    :pagination.sync="pagination"
                    rows-per-page-text=""
                    :loading="loading"
                    class="elevation-1"
                    disable-initial-sort
                    :rows-per-page-items="rowsPerPageItems"
                    hide-actions
                    no-data-text="데이터가 없습니다"
                    no-results-text="데이터가 없습니다"
                >
                    <!-- props.item 을 디스트럭쳐링함. 그리고 tr에 read(item)을 적용
                    <template slot="items" slot-scope="{ item }">
                        <tr @click="read(item)" style="cursor:pointer">
                            <td class="hidden-sm-and-down">{{ id2date(item._id) }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item._user ? item._user.id : '손님' }}</td>
                            <td>{{ item.cnt.view }}</td>
                            <td>{{ item.cnt.like }}</td>
                        </tr>
                    </template> -->
                    <template slot="items" slot-scope="props">
                        <td class="hidden-sm-and-down">{{ id2date(props.item._id) }}</td>
                        <td><a @click="read(props.item)">{{ props.item.title }}</a>
                        </td>
                        <td>{{ props.item._user ? props.item._user.id : '손님' }}</td>
                        <td>{{ props.item.cnt.view }}</td>
                        <td>{{ props.item.cnt.like }}</td>
                    </template>

                    <!-- footer 에 페이징 -->
                    <template v-slot:footer>
                        <td :colspan="headers.length" class="text-xs-center py-3">
                            <v-pagination
                                v-model="pagination.page"
                                :length="pages"
                                circle
                                :total-visible="7"
                            ></v-pagination>
                        </td>
                    </template>

                </v-data-table>

                <!-- table 바깥에 페이징을 보여줄 때 -->
                <!-- <div class="text-xs-center pt-2">
                    <v-pagination
                        v-model="pagination.page"
                        :length="pages"
                        circle
                        :total-visible="7"
                        prev-icon="arrow_back"
                        next-icon="arrow_forward"
                    ></v-pagination>
                </div> -->

            </v-flex>
        </v-layout>

        <v-btn
            color="pink"
            dark
            small
            absolute
            top
            right
            fab
            @click="addDialog"
        >
            <v-icon>add</v-icon>
        </v-btn>

        <!-- <v-dialog v-model="dialog" persistent :max-width="($vuetify.breakpoint.width - 100)"> -->
        <v-dialog v-model="dialog" persistent max-width="600px" :fullscreen="$vuetify.breakpoint.xs">
            <!-- <v-card v-if="!dlMode" :height="($vuetify.breakpoint.height - 200)"> -->
            <v-card v-if="!dlMode">
                <v-card-title>
                    <span class="headline">{{selArticle.title}}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    {{selArticle.content}}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-3">
                    <v-spacer></v-spacer>
                    <v-btn color="warning darken-1" flat @click.native="modDialog()">수정</v-btn>
                    <v-btn color="error darken-1" flat @click.native="ca=true">삭제</v-btn>
                    <v-btn color="secondary darken-1" flat @click.native="dialog = false">닫기</v-btn>
                </v-card-actions>
                <v-card-text v-if="ca">
                    <v-alert v-model="ca" type="warning">
                        <h4>정말 진행 하시겠습니까?</h4>
                        <v-btn color="error" @click="del()">확인</v-btn>
                        <v-btn color="secondary" @click="ca=false">취소</v-btn>
                    </v-alert>
                </v-card-text>
            </v-card>
            <v-card v-else>
                <v-card-title>
                    <span class="headline">글 {{(dlMode === 1) ? '작성' : '수정'}}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            label="제목"
                            persistent-hint
                            required
                            v-model="form.title"
                        ></v-text-field>
                        <v-textarea
                            label="내용"
                            persistent-hint
                            required
                            v-model="form.content"
                        ></v-textarea>

                        <vue-recaptcha
                            ref="recaptcha"
                            :sitekey="$cfg.recaptchaSiteKey"
                            size="invisible"
                            @verify="onVerify"
                            @expired="onExpired"
                        >
                        </vue-recaptcha>
                    </v-form>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="checkRobot()">확인</v-btn>
                    <v-btn color="red darken-1" flat @click.native="dialog = false">취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
// vuex store 를 쓰기 위해서
import store from '@/store.js'

export default {
    data: () => ({
        board: {
            name: '로딩중...',
            rmk: '무엇?'
        },
        articles: [],
        dialog: false,
        lvs: [0, 1, 2, 3],
        form: {
            title: '',
            content: '',
            response: ''
        },
        headers: [
            { text: '날짜', value: '_id', sortable: true, width: '10%', class: 'hidden-sm-and-down' },
            { text: '제목', value: 'title', sortable: true, align: 'left', width: '45%' },
            { text: '글쓴이', value: '_user', sortable: false, width: '25%' },
            { text: '조회수', value: 'cnt.view', sortable: true, width: '10%' },
            { text: '추천', value: 'cnt.like', sortable: true, width: '10%' }
        ],
        loading: false,
        itemTotal: 0,
        getTotalPage: 1,
        dlMode: 0, // 0: read, 1: write, 2: modify
        selArticle: {},
        ca: false,
        params: {
            draw: 0,
            search: '',
            skip: 0,
            sort: '_id',
            order: 0,
            limit: 1
        },
        timeout: null,
        // pagination: {},
        pagination: { // 초기값을 여기서 지정한다.
            sortBy: '_id', // 아이디 정렬을 초기값으로
            descending: true, // 내림차순을 초기값으로
            rowsPerPage: 10 // 리스트 갯수 초기값
            // ,sortBy: 'title' // 정렬대상 초기값을 제목으로
        },
        rowsPerPageItems: [ 1, 2, 5, 10, 15, 30, 50 ]
    }),
    mounted () {
        this.getBoard()
        // console.log('>> ', this.$vuetify.breakpoint.height)
    },
    watch: {
        pagination: {
            handler () {
                this.list()
            },
            deep: true
        },
        'params.search': {
            handler () {
                this.delay()
                // this.list()
            }
        },
        // 라우트 감시 - 게시판을 변경하는 라우트를 감시한다.
        // 게시판에서 동적 라우트 매칭을 사용하면서 문제가 생김
        '$route' (to, from) {
            // console.log(to.path, from.path)

            // this.$router.push(to.path) // not working
            // location.href = to.path // 정상적으로 가지만 매끄럽지 못하고 게시판 메뉴가 닫힌다.(페이지 리로딩)
            // this.$router.go(to.path) == location.href
            // this.$router.replace(to.path) // not working

            // ** 얘를 하면 바로 게시판을 들고 온다. 정상적인 루트를 타지 않으므로 pageCheck 을 타지 않는다.
            // this.getBoard()

            // ** 별수없이 여기서 페이지체크를 해야 한다.
            this.$axios.post('page', { name: to.path })
                .then((r) => {
                    if (!r.data.success) throw new Error(r.data.msg)
                    // next() // not function
                    this.getBoard() // 이걸로 대체
                })
                .catch((e) => {
                    // next(`/block/${e.message.replace(/\//gi, ' ')}`) // 블로킹 페이지로 가던것을 막았다...
                    if (!e.response) store.commit('pop', { msg: e.message, color: 'warning' })
                    // next(false) // not function 이제 못가게 막는걸로 변경되었다.

                    // * 토큰 유효기간이 끝난 경우 기존 토큰을 모두 삭제하고 로그인창으로 보낸다.
                    if (e.message.includes('ERR01-TOKEN') || e.message.includes('jwt expired')) {
                        setTimeout(() => {
                            store.commit('delToken')
                            location.href = '/sign'
                        }, 800)
                    }
                })
        }
    },
    computed: {
        setSkip () {
            if (this.pagination.page <= 0) return 0
            return (this.pagination.page - 1) * this.pagination.rowsPerPage
        },
        setSort () {
            let order = this.pagination.sortBy
            if (!this.pagination.sortBy) order = '_id'
            return order
        },
        setOrder () {
            return this.pagination.descending ? -1 : 1
        },
        pages () { // 페이징에서 쓰이는 컴퓨티드
            if (this.pagination.rowsPerPage == null ||
                this.pagination.totalItems == null
            ) return 0
            return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        }
    },
    methods: {
        onVerify (r) {
            this.form.response = r
            this.$refs.recaptcha.reset()
            if (this.dlMode === 1) this.add()
            else this.mod()
        },
        onExpired () {
            this.form.response = ''
            this.$refs.recaptcha.reset()
        },
        checkRobot () {
            if (this.form.response === '') return this.$refs.recaptcha.execute()
            if (this.dlMode === 1) this.add()
            else this.mod()
        },
        toggleOrder () { // test add - 정렬순서를 반대로
            this.pagination.descending = !this.pagination.descending
            this.list()
        },
        addDialog () {
            this.dialog = true
            this.dlMode = 1
            this.form.title = ''
            this.form.content = ''
        },
        modDialog () {
            this.dlMode = 2
            this.form.title = this.selArticle.title
            this.form.content = this.selArticle.content
        },
        getBoard () {
            this.$axios.get(`board/read/${this.$route.params.name}`)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg)
                    this.board = data.d
                    this.list()
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        add () {
            if (!this.form.title) return this.$store.commit('pop', { msg: '제목을 작성해주세요', color: 'warning' })
            if (!this.form.content) return this.$store.commit('pop', { msg: '내용을 작성해주세요', color: 'warning' })
            this.$axios.post(`article/${this.board._id}`, this.form)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.mgs)
                    this.dialog = false
                    this.list()
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        list () {
            if (this.loading) return
            if (!this.board._id) return
            this.loading = true

            // console.log(`skip: ${this.setSkip}`)
            // console.log(`rowsPerPage: ${this.pagination.rowsPerPage}`)
            // console.log(`sort: ${this.setSort}`)
            // console.log(`order: ${this.setOrder}`)

            this.params.draw++
            this.params.skip = this.setSkip
            this.params.limit = this.pagination.rowsPerPage
            this.params.sort = this.setSort
            this.params.order = this.setOrder

            this.$axios.get(`article/list/${this.board._id}`, { params: this.params })
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.mgs)
                    this.pagination.totalItems = data.t
                    this.articles = data.ds
                    this.loading = false
                    // console.log(this.pagination)
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                    this.loading = false
                })
        },
        read (atc) {
            // 여기가 중요! read(props.item) 로 보냈기 때문에 메모리 주소가 같다. 때문에 변경되면 리스트의 props.item 도 같이 변경된다.
            this.selArticle = atc
            this.loading = true
            this.$axios.get(`article/read/${atc._id}`)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.mgs)
                    this.dlMode = 0
                    this.dialog = true
                    this.selArticle.content = data.d.content
                    this.selArticle.cnt.view = data.d.cnt.view
                    this.loading = false
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                    this.loading = false
                })
        },
        mod () {
            if (!this.form.title) return this.$store.commit('pop', { msg: '제목을 작성해주세요', color: 'warning' })
            if (!this.form.content) return this.$store.commit('pop', { msg: '내용을 작성해주세요', color: 'warning' })
            if (this.selArticle.title === this.form.title && this.selArticle.content === this.form.content) {
                return this.$store.commit('pop', { msg: '변경된 내용이 없습니다', color: 'warning' })
            }
            this.$axios.put(`article/${this.selArticle._id}`, this.form)
                .then(({ data }) => {
                    this.dialog = false
                    if (!data.success) throw new Error(data.msg)
                    this.selArticle.title = data.d.title
                    this.selArticle.content = data.d.content
                    // this.list()
                })
                .catch((e) => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        del () {
            this.$axios.delete(`article/${this.selArticle._id}`)
                .then(({ data }) => {
                    this.dialog = false
                    if (!data.success) throw new Error(data.msg)
                    this.list()
                })
                .catch((e) => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        id2date (val) {
            if (!val) return '잘못된 시간정보'
            // return new Date(parseInt(val.substring(0, 8), 16) * 1000).toLocaleString()
            return this.$moment(parseInt(val.substring(0, 8), 16) * 1000).format('YY.MM.DD')
        },
        delay () {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.list()
            }, 1000)
        }
    }
}
</script>

<style>
/* .v-datatable__actions__select {
    visibility: hidden
}
.v-datatable__actions__range-controls {
    display: none;
} */

.custom-text-truncate {
    /* white-space: nowrap !important; 얘를 지우면 두줄이 나온다. */
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    line-height: 1.1 !important;
}
.overme { /* div의 width 를 고정값으로 하면 ... 가 된다. */
    width: 100%;
    overflow: hidden !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
}
</style>
