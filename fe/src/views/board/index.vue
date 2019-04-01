<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-img
                        class="white--text"
                        height="70px"
                        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
                    >
                        <v-container fill-height fluid>
                            <v-layout fill-height>
                                <v-flex xs6 align-end flexbox>
                                    <span class="headline">{{board.name}}</span>
                                </v-flex>
                                <v-flex xs6 align-end flexbox class="text-xs-right">
                                    <span>{{board.rmk}}</span>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-img>
                </v-card>
            </v-flex>

            <!-- <v-flex xs12 sm6 md4 v-for="article in articles" :key="article._id">
                {{article}}
            </v-flex> -->
            <v-flex xs12 sm4 offset-sm8>
                <v-text-field
                    label="검색"
                    append-icon="search"
                    v-model="params.search"
                    clearable
                ></v-text-field>
            </v-flex>

            <v-flex xs12>
                <!-- :rows-per-page-items=[5,15,30,50] 로 초기값 변경 -->
                <!-- hide-actions 하단의 액션을 없앤다 -->
                <!-- class : 'text-no-wrap' 은 늘어나도 랩하지 않음, 'text-truncate'은 ... 으로 랩 -->
                <v-toolbar flat color="white">
                    <v-chip outline color="grey darken-3">
                        <v-icon left>list_alt</v-icon>{{pagination.totalItems}}건
                    </v-chip>
                    <v-spacer></v-spacer>
                    <div style="width: 100px">
                        <v-select
                            :items="rowsPerPageItems"
                            v-model="pagination.rowsPerPage"
                            label="검색건수"
                        ></v-select>
                    </div>
                </v-toolbar>

                <v-data-table
                    :headers="headers"
                    :items="articles"
                    :total-items="pagination.totalItems"
                    :pagination.sync="pagination"
                    rows-per-page-text=""
                    :loading="loading"
                    class="elevation-0"
                    disable-initial-sort
                    :rows-per-page-items="rowsPerPageItems"
                >
                    <template slot="items" slot-scope="props">
                        <td class="hidden-sm-and-down">{{ id2date(props.item._id) }}</td>
                        <td><a @click="read(props.item)">{{ props.item.title }}</a>
                        </td>
                        <td>{{ props.item._user ? props.item._user.id : '손님' }}</td>
                        <td>{{ props.item.cnt.view }}</td>
                        <td>{{ props.item.cnt.like }}</td>
                    </template>
                </v-data-table>
                <div class="text-xs-center pt-2">
                    <v-pagination
                        v-model="pagination.page"
                        :length="pages"
                        circle
                        :total-visible="7"
                        prev-icon="arrow_back"
                        next-icon="arrow_forward"
                    ></v-pagination>
                    <!-- <v-btn @click="toggleOrder"><v-icon>keyboard_arrow_down</v-icon></v-btn> -->
                </div>
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

        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card v-if="!dlMode">
                <v-card-title>
                    <span class="headline">{{selArticle.title}}</span>
                </v-card-title>
                <v-card-text>
                    {{selArticle.content}}
                </v-card-text>
                <v-card-actions>
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
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field
                                    label="제목"
                                    persistent-hint
                                    required
                                    v-model="form.title"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea
                                    label="내용"
                                    persistent-hint
                                    required
                                    v-model="form.content"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="(dlMode === 1) ? add() : mod()">확인</v-btn>
                    <v-btn color="red darken-1" flat @click.native="dialog = false">취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
// import boardCard from '@/components/manage/boardCard'

export default {
    // components: { boardCard },
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
            content: ''
        },
        headers: [
            { text: '날짜', value: '_id', sortable: true, width: '10%', class: 'hidden-sm-and-down grey lighten-4' },
            { text: '제목', value: 'title', sortable: true, align: 'left', width: '45%', class: 'grey lighten-4' },
            { text: '글쓴이', value: '_user', sortable: false, width: '25%', class: 'grey lighten-4' },
            { text: '조회수', value: 'cnt.view', sortable: true, width: '10%', class: 'grey lighten-4' },
            { text: '추천', value: 'cnt.like', sortable: true, width: '10%', class: 'grey lighten-4' }
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
            descending: true, // 내림차순을 초기값으로
            rowsPerPage: 5 // 리스트 갯수 초기값
            // ,sortBy: 'title' // 정렬대상 초기값을 제목으로
        },
        rowsPerPageItems: [ 1, 2, 5, 15, 30, 50 ]
    }),
    mounted () {
        this.getBoard()
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
        // 라우트 감시 - 게시판을 변경하는 라우트를 감시한다
        '$route' (to, from) {
            // console.log(to.path, from.path)
            this.getBoard()
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
        toggleOrder () { // test add - 정렬순서를 반대로
            this.pagination.descending = !this.pagination.descending
            this.list()
        },
        addDialog () {
            this.dialog = true
            this.dlMode = 1
            this.form = {
                title: '',
                content: ''
            }
        },
        modDialog () {
            this.dlMode = 2
            this.form = {
                title: this.selArticle.title,
                content: this.selArticle.content
            }
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

<style scoped>
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
