<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>회원가입</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <form>
                            <v-text-field
                                v-model="form.id"
                                v-validate="'required|min:2|max:12|alpha_num'"
                                :counter="12"
                                :error-messages="errors.collect('id')"
                                label="아이디"
                                data-vv-name="id"
                                required
                                maxlength="12"
                            ></v-text-field>
                            <v-text-field
                                v-model="form.pwd"
                                v-validate="'required|min:4|max:12'"
                                :counter="12"
                                :error-messages="errors.collect('pwd')"
                                label="비밀번호"
                                data-vv-name="pwd"
                                required
                                maxlength="12"
                                type="password"
                            ></v-text-field>
                            <v-text-field
                                v-model="form.name"
                                v-validate="'required|min:4|max:20'"
                                :counter="20"
                                :error-messages="errors.collect('name')"
                                label="이름"
                                data-vv-name="name"
                                required
                                maxlength="20"
                            ></v-text-field>

                            <v-checkbox
                                v-model="agree"
                                v-validate="'required'"
                                :error-messages="errors.collect('agree')"
                                value="1"
                                label="동의"
                                data-vv-name="agree"
                                type="checkbox"
                                required
                            ></v-checkbox>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="submit">가입</v-btn>
                            <v-btn color="secondary" @click="clear">초기화</v-btn>
                        </form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
// import ko from 'vee-validate/dist/locale/ko'
import { messages } from 'vee-validate/dist/locale/ko'

export default {
    $_veeValidate: {
        validator: 'new'
    },
    data: () => ({
        form: {
            id: '',
            name: '',
            pwd: ''
        },
        agree: null,
        dictionary: {
            messages: messages, // ko.messages,
            // custom 필드명 - 메세지의 필드명을 바꿀 수 있다.
            attributes: {
                id: '아이디',
                pwd: '비밀번호',
                name: '이름',
                agree: '동의'
                // custom attributes
            },
            // 커스텀 메시지 변경
            custom: {
                name: {
                    required: () => '이름을 입력하세요(커스텀)',
                    max: '이름은 20자를 넘을 수 없습니다'
                    // custom messages
                },
                // select: {
                //     required: '항목을 선택하세요'
                // },
                // 이메일 형식 조사 - 에러 메시지를 한글로 변경하기위해 추가
                // email: {
                //     required: '이메일을 입력하세요',
                //     email: '올바른 이메일 형식이 아닙니다'
                // },
                // 체크박스도 커스텀으로 변경
                agree: {
                    required: '동의를 선택하세요(커스텀)'
                }
            }
        }
    }),
    mounted () {
        this.$validator.localize('ko', this.dictionary)
    },
    methods: {
        submit () {
            this.$validator.validateAll()
                .then(async response => {
                    if (!response) throw new Error('모두 기입해 주세요')
                    const r = await this.$axios.post('register', this.form)
                    if (!r.data.success) {
                        await this.clear() // form clear
                        throw new Error(`서버가 거부했습니다. ${r.data.msg}`)
                    }
                    this.$store.commit('pop', { msg: '가입 완료 되었습니다', color: 'success' })
                    this.$router.push('/sign')
                })
                // .then(r => {
                //     if (!r) throw new Error('모두 기입해 주세요')
                //     return this.$axios.post('register', this.form)
                // })
                // .then(r => {
                //     if (!r.data.success) {
                //         this.clear() // form clear
                //         throw new Error(`서버가 거부했습니다. ${r.data.msg}`)
                //     }
                //     this.pop('가입 완료 되었습니다', 'success')

                //     this.$router.push('/sign')
                // })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        clear () {
            this.form.id = ''
            this.form.pwd = ''
            this.form.name = ''
            this.agree = null
            this.$validator.reset()
        }
    }
}
</script>
