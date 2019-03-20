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
                        <v-container>
                            <v-layout fill-height>
                                <v-flex xs6 align-end flexbox>
                                    <span class="headline">{{board.name}}</span>
                                </v-flex>
                                <v-flex xs6 align-end flexbox>
                                    <span>{{board.rmk}}</span>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-img>
                </v-card>
            </v-flex>
        </v-layout>

        <v-snackbar
            v-model="sb.act"
            top
        >
            {{ sb.msg }}
            <v-btn
                :color="sb.color"
                flat
                @click="sb.act = false"
            >
                닫기
            </v-btn>
        </v-snackbar>

    </v-container>
</template>

<script>
export default {
    data: () => ({
        board: {
            name: '로딩중...',
            rmk: '무엇?'
        },
        sb: {
            act: false,
            msg: '',
            color: 'warning'
        }
    }),
    mounted () {
        this.getBoard()
    },
    methods: {
        getBoard () {
            this.$axios.get('board/아무나')
                // .then(r => {
                //     r.data.d
                // })
                // response.data === { data } 이므로 데이터만 바로 빼와도 된다.
                .then(({ data }) => {
                    if (!data.success) throw new Error(data.msg)
                    this.board = data.d
                })
                .catch(e => {
                    this.pop(e.message, 'error')
                })
        },
        pop (m, c) {
            this.sb.act = true
            this.sb.msg = c
            this.sb.color = c
        }
    }
}
</script>
