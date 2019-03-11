<template>
    <v-container grid-list-lg>
        <!-- {{ this.$vuetify.breakpoint }} -->
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="(user, i) in users" :key="user._id">
                <v-card>
                    <v-card-title primary-title>
                        <div v-bind:id="[`user-${i}`]">
                            <h3 class="headline mb-0">{{user.id}}</h3>
                        </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-title primary-title>
                        <div>
                            <div>이름 : {{user.name}}</div>
                            <div>권한 : {{user.lv}}</div>
                            <div>나이 : {{user.age}}</div>
                            <div>로그인 횟수 : {{user.inCnt}}</div>
                        </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-actions>
                        <v-btn flat color="orange" @click="putDialog(user)">수정</v-btn>
                        <!-- <v-btn flat color="error" @click="delUser(user._id, confirmDelete)">삭제</v-btn> -->
                        <v-btn flat color="error" @click="confirmDelete(user._id)">삭제</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field
                                label="이름"
                                hint="예)홍길동"
                                persistent-hint
                                required
                                v-model="userName"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                :items="userLvs"
                                label="권한"
                                required
                                v-model="userLv"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                :items="userAges"
                                label="나이"
                                required
                                v-model="userAge"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="putUser">수정</v-btn>
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
            users: [],
            dialog: false,
            confirmDialog: false,
            userAges: [],
            userLvs: [],
            userAge: 0,
            userLv: 0,
            userName: '',
            putId: '',
            snackbar: false,
            sbMsg: ''
        }
    },
    mounted () {
        for (let i = 10; i < 50; i++) this.userAges.push(i)
        for (let i = 0; i < 4; i++) this.userLvs.push(i)
        this.getUsers()
    },
    methods: {
        getUsers () {
            this.$axios.get(`${this.$apiRootPath}manage/user`)
                .then(r => {
                    this.users = r.data.users
                })
                .catch(e => {
                    // eslint-disable-next-line
                    // console.error(e.message)
                    this.pop(e.message)
                })
        },
        putDialog (user) {
            this.putId = user._id
            this.userName = user.name
            this.userAge = user.age
            this.userLv = user.lv
            this.dialog = true
        },
        putUser () {
            this.dialog = false
            const uId = this.putId // 임시로 다른 변수에 넣고
            this.putId = '' // 이 변수는 초기화
            this.$axios.put(`${this.$apiRootPath}manage/user/${uId}`, {
                name: this.userName, lv: this.userLv, age: this.userAge
            })
                .then(r => {
                    this.pop('사용자 수정 완료')
                    this.getUsers()
                })
                .catch(e => {
                    this.pop(e.message)
                })
        },
        delUser () {
            const dId = this.putId
            this.putId = '' // 비운다
            this.$axios.delete(`${this.$apiRootPath}manage/user/${dId}`)
                .then(r => {
                    this.pop('사용자 삭제 완료')
                    this.getUsers()
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
                this.delUser()
            }
        },
        pop (msg) {
            this.snackbar = true
            this.sbMsg = msg
        }
    }
}
</script>
