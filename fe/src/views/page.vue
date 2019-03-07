<template>
    <v-container grid-list-lg>
        <!-- {{ this.$vuetify.breakpoint }} -->
        <v-alert
            :value="!pages.length"
            type="warning"
        >
            데이터가 없습니다!
        </v-alert>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="(page, i) in pages" :key="page._id">
                <v-card>
                    <v-card-title primary-title>
                        <div v-bind:id="[`page-${i}`]">
                            <h3 class="headline mb-0">{{page.name}}</h3>
                        </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-title primary-title>
                        <div>
                            <div>권한 : {{page.lv}}</div>
                            <div>진입 횟수 : {{page.inCnt}}</div>
                        </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-actions>
                        <v-btn flat color="orange" @click="putDialog(page)">수정</v-btn>
                        <v-btn flat color="error" @click="confirmDelete(page._id)">삭제</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">페이지 수정</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                label="페이지 이름"
                                hint="예)게시판"
                                persistent-hint
                                required
                                v-model="pageName"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                :items="pageLvs"
                                label="권한"
                                required
                                v-model="pageLv"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="putPage">수정</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="dialog = false">닫기</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="confirmDialog" max-width="250" max-height="230">
            <v-card>
                <v-card-text>정말 삭제하시겠습니까?</v-card-text>
                <v-subheader>삭제된 데이터는 복구할 수 없습니다.</v-subheader>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="confirmYn(true)">확인</v-btn>
                    <v-btn color="gray darken-1" flat @click="confirmYn(false)">취소</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
            v-model="snackbar"
            top
        >
            {{ sbMsg }}
            <v-btn
                color="pink"
                flat
                @click="snackbar = false"
            >
            Close
            </v-btn>
        </v-snackbar>

    </v-container>
</template>

<script>

export default {
    data () {
        return {
            pages: [],
            dialog: false,
            confirmDialog: false,
            pageLvs: [],
            pageLv: 0,
            pageName: '',
            snackbar: false,
            sbMsg: '',
            putId: ''
        }
    },
    mounted () {
        for (let i = 0; i < 4; i++) this.pageLvs.push(i)
        this.getPages()
    },
    methods: {
        getPages () {
            this.$axios.get(`${this.$apiRootPath}manage/page`)
                .then(r => {
                    this.pages = r.data.pages
                })
                .catch(e => {
                    // eslint-disable-next-line
                    console.error(e.message)
                })
        },
        putDialog (page) {
            this.putId = page._id
            this.pageName = page.name
            this.pageLv = page.lv
            this.dialog = true
        },
        putPage () {
            this.dialog = false
            const pId = this.putId // 임시로 다른 변수에 넣고
            this.putId = '' // 이 변수는 초기화
            this.$axios.put(`${this.$apiRootPath}manage/page/${pId}`, {
                name: this.pageName, lv: this.pageLv
            })
                .then(r => {
                    this.pop('페이지 수정 완료')
                    this.getPages()
                })
                .catch(e => {
                    this.pop(e.message)
                })
        },
        delPage () {
            const dId = this.putId
            this.putId = '' // 비운다
            this.$axios.delete(`${this.$apiRootPath}manage/page/${dId}`)
                .then(r => {
                    this.pop('페이지 삭제 완료')
                    this.getPages()
                })
                .catch(e => {
                    this.pop(e.message)
                })
        },
        confirmDelete (id) {
            this.confirmDialog = true
            this.putId = id // 삭제할 아이디를 임시로 담는다.
        },
        confirmYn (yesno) {
            this.confirmDialog = false
            if (yesno) {
                this.delPage()
            }
        },
        pop (msg) {
            this.snackbar = true
            this.sbMsg = msg
        }
    }
}
</script>
