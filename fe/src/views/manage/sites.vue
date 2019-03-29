<template>
    <v-container grid-list-lg>
        <!-- {{ this.$vuetify.breakpoint }} -->
        <v-alert
            :value="!sites.length"
            type="warning"
        >
            데이터가 없습니다!
        </v-alert>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="(site, i) in sites" :key="site._id">
                <v-card>
                    <v-card-title primary-title>
                        <div v-bind:id="[`site-${i}`]">
                            <h3 class="headline mb-0">{{site.title}}</h3>
                        </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-title primary-title>
                        <div>
                            <div>하단 : {{site.copyright}}</div>
                            <div>색상 : {{site.dark}}</div>
                        </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-actions>
                        <v-btn flat color="orange" @click="putDialog(site)">수정</v-btn>
                        <v-btn flat color="error" @click="confirmDelete(site._id)">삭제</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">사이트 수정</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                label="사이트 이름"
                                hint="예)default"
                                persistent-hint
                                required
                                v-model="siteTitle"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                label="사이트 하단"
                                hint="예)© 2019 copyright"
                                persistent-hint
                                required
                                v-model="siteCopyright"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-switch
                                    label="다크모드"
                                    v-model="siteDark"
                                ></v-switch>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="putSite">수정</v-btn>
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

    </v-container>
</template>

<script>

export default {
    data () {
        return {
            sites: [],
            dialog: false,
            confirmDialog: false,
            siteTitle: '',
            siteCopyright: '',
            siteDark: false,
            putId: ''
        }
    },
    mounted () {
        this.getSites()
    },
    methods: {
        getSites () {
            // this.$axios.get(`${this.$apiRootPath}manage/site`)
            this.$axios.get('manage/site')
                .then(r => {
                    this.sites = r.data.sites
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        putDialog (site) {
            this.putId = site._id
            this.siteTitle = site.title
            this.siteCopyright = site.copyright
            this.siteDark = site.dark
            this.dialog = true
        },
        putSite () {
            this.dialog = false
            const pId = this.putId // 임시로 다른 변수에 넣고
            this.putId = '' // 이 변수는 초기화
            // this.$axios.put(`${this.$apiRootPath}manage/site/${pId}`, {
            this.$axios.put(`manage/site/${pId}`, {
                title: this.siteTitle, copyright: this.siteCopyright, dark: this.siteDark
            })
                .then(r => {
                    this.$store.commit('pop', { msg: '사이트 수정 완료', color: 'success' })
                    this.getSites()
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        delSite () {
            this.$store.commit('pop', { msg: '사이트 삭제하면 안되요!', color: 'error' })

            // 사이트 설정은 삭제 불가
            // const dId = this.putId
            // this.putId = '' // 비운다
            // this.$axios.delete(`manage/site/${dId}`)
            //     .then(r => {
            //         this.pop('사이트 삭제 완료')
            //         this.getSites()
            //     })
            //     .catch(e => {
            //         if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
            //     })
        },
        confirmDelete (id) {
            this.confirmDialog = true
            this.putId = id // 삭제할 아이디를 임시로 담는다.
        },
        confirmYn (yesno) {
            this.confirmDialog = false
            if (yesno) {
                this.delSite()
            }
        }
    }
}
</script>
