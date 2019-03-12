<template>
    <v-dialog v-model="dialog" persistent max-width="500px" @keydown.esc="cancel">
        <v-card>
            <v-toolbar dark :color="options.color" dense flat>
                <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
            </v-toolbar>
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
            <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="putUser">수정</v-btn>
                <v-btn color="blue darken-1" flat @click.native="cancel">닫기</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [],
    data () {
        return {
            dialog: false,
            resolve: null,
            reject: null,
            userAges: [],
            userLvs: [],
            userAge: 0,
            userLv: 0,
            userName: '',
            putId: '',
            message: null,
            title: null,
            options: {
                color: 'primary',
                width: 500
            }
        }
    },
    mounted () {
        for (let i = 10; i < 50; i++) this.userAges.push(i)
        for (let i = 0; i < 4; i++) this.userLvs.push(i)
    },
    methods: {
        open (user, title, options) {
            this.putId = user._id
            this.userName = user.name
            this.userAge = user.age
            this.userLv = user.lv

            this.title = title
            this.options = Object.assign(this.options, options)
            this.dialog = true

            return new Promise((resolve, reject) => {
                this.resolve = resolve
                this.reject = reject
            })
        },
        putUser () {
            this.dialog = false
            const uId = this.putId // 임시로 다른 변수에 넣고
            this.putId = '' // 이 변수는 초기화
            this.$axios.put(`manage/user/${uId}`, {
                name: this.userName, lv: this.userLv, age: this.userAge
            })
                .then(r => {
                    this.clear()
                    this.resolve('edit success')
                })
                .catch(e => {
                    this.reject(new Error('Edit error'))
                })
        },
        cancel () {
            this.clear()
            this.resolve(false)
            this.dialog = false
        },
        clear () {
            this.userAge = 0
            this.userLv = 0
            this.userName = ''
            this.putId = ''
        }
    }
}
</script>
