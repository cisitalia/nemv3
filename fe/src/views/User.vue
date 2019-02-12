<template>
    <v-container grid-list-lg text-xs-center>
        <!-- {{ this.$vuetify.breakpoint }} -->
        <v-layout row wrap>
            <!-- floating action button -->
            <v-btn
            absolute
            dark
            fab
            top
            right
            color="pink"
            @click="mdUp"
            >
                <v-icon>add</v-icon>
            </v-btn>

            <v-flex xs12 sm6 md4 lg3 v-for="(user, i) in users" :key="user._id">
                <v-card>
                    <v-card-title primary-title>
                        <div v-bind:id="[`user-${i}`]">
                            <h3 class="headline mb-0">{{user.name}}</h3>
                            <div>{{user.age}}</div>
                        </div>
                    </v-card-title>
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
                                label="Legal last name"
                                hint="example of persistent helper text"
                                persistent-hint
                                required
                                v-model="userName"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6>
                                <v-select
                                :items="userAges"
                                label="Age"
                                required
                                v-model="userAge"
                                ></v-select>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="this.putState === true" color="blue darken-1" flat @click="putUser">수정</v-btn>
                    <v-btn v-else color="blue darken-1" flat @click="postUser">등록</v-btn>
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
import axios from 'axios'

export default {
    data () {
        return {
            users: [],
            dialog: false,
            confirmDialog: false,
            userAges: [],
            userAge: 0,
            userName: '',
            putId: '',
            snackbar: false,
            sbMsg: '',
            putState: false
        }
    },
    mounted () {
        for (let i = 20; i < 50; i++) this.userAges.push(i)
        this.getUsers()
    },
    methods: {
        getUsers () {
            axios.get('http://localhost:3000/api/user')
                .then(r => {
                    // console.log(r.data)
                    this.users = r.data.users
                })
                .catch(e => {
                    console.error(e.message)
                })
        },
        mdUp () {
            this.userName = ''
            this.userAge = ''
            this.dialog = true
        },
        postUser () {
            this.dialog = false
            // console.log(this.userName + ', ' + this.userAge)
            axios.post('http://localhost:3000/api/user', {
                name: this.userName, age: this.userAge
            })
                .then(r => {
                    this.pop('사용자 등록 완료')
                    this.getUsers()
                })
                .catch(e => {
                    this.pop(e.message)
                })
        },
        pop (msg) {
            this.snackbar = true
            this.sbMsg = msg
        },
        putDialog (user) {
            this.putId = user._id
            this.userName = user.name
            this.userAge = user.age
            this.putState = true
            this.dialog = true
        },
        putUser () {
            this.dialog = false
            const uId = this.putId // 임시로 다른 변수에 넣고
            this.putId = '' // 이 변수는 초기화
            this.putState = false
            axios.put(`http://localhost:3000/api/user/${uId}`, {
                name: this.userName, age: this.userAge
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

            axios.delete(`http://localhost:3000/api/user/${dId}`)
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
        }
    }
}
</script>
