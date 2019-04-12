<template>
    <v-card height="100%">
        <v-toolbar color="cyan" dark tabs>
            <v-toolbar-title>{{board.title}}</v-toolbar-title>

            <template v-slot:extension>
                <v-tabs v-model="tab" centered color="cyan" slider-color="yellow">
                    <v-tab v-for="article in articles" :key="article._id" ripple>{{article.title}}</v-tab>
                </v-tabs>
            </template>
        </v-toolbar>

        <v-tabs-items v-model="tab">
            <v-tab-item v-for="article in articles" :key="article._id">
                <v-card flat>
                    <!-- <v-card-text v-html="article.content"></v-card-text> -->
                    <v-card-text>
                        <viewer
                            :value="article.content"
                        />
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
        <!-- <v-btn @click="test">test</v-btn> -->
    </v-card>
</template>

<script>
export default {
    data: () => ({
        board: {
            name: '로딩중...',
            title: '로딩중...',
            rmk: '무엇?'
        },
        tab: null,
        loading: false,
        params: {
            draw: 0,
            search: '',
            skip: 0,
            sort: '_id',
            order: -1, // 1 asc / -1 desc
            limit: 10
        },
        articles: []
    }),
    mounted () {
        this.getBoard()
    },
    watch: {
        tab (t) {
            // console.log(t)
            if (this.articles.length) this.read(t)
        }
    },
    methods: {
        test () {
            this.articles[0].content = Math.random()
        },
        getBoard () {
            this.$axios.get(`board/read/link`)
                .then(({ data }) => {
                    // console.log(data)
                    if (!data.success) throw new Error(data.msg)
                    this.board = data.d
                    this.list()
                })
                .catch((e) => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        list () {
            if (!this.board._id) return
            this.loading = true
            this.params.draw += 1

            this.$axios.get(`article/list/${this.board._id}`, { params: this.params })
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg)
                    data.ds.forEach((v) => {
                        v.content = '' // 이렇게 하지 않으면 v-tab에서 렌더링이 안된다고 함.
                    })
                    this.articles = data.ds
                    // console.log(this.articles) // 찍어보면 첫번째 content만 안지워져있다.
                    this.loading = false
                })
                .catch((e) => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                    this.loading = false
                })
        },
        read (i) {
            const atc = this.articles[i]
            this.loading = true
            this.$axios.get(`article/read/${atc._id}`)
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg)
                    // console.log(data)
                    atc.content = data.d.content
                    atc.cnt.view = data.d.cnt.view
                    this.loading = false
                })
                .catch((e) => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                    this.loading = false
                })
        }
    }
}
</script>
