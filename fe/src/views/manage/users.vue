<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm6 v-for="(user, i) in users" :key="i" :id="`user-${i}`">
                <user-list :user="user" @sendOpenDialog="putDialog" @sendConfirmDelete="confirmDelete"></user-list>
            </v-flex>
        </v-layout>

        <user-dialog ref="userDialog"></user-dialog>
        <confirm ref="confirm"></confirm>

    </v-container>
</template>

<script>
// 컴포넌트로 쪼개기 전 이 파일의 원본은 user2.vue 에 있다.
// 유저 리스트, 수정 다이얼로그, 삭제 다이얼로그 3개로 나뉘어 있다.

import userList from '@/components/userList'
import userDialog from '@/components/userDialog'
import confirm from '@/components/confirm'

export default {
    components: { userList, userDialog, confirm },
    data: () => ({
        users: [],
        putId: ''
    }),
    mounted () {
        this.getUsers()
    },
    methods: {
        getUsers () {
            this.$axios.get('manage/user')
                .then(r => {
                    this.users = r.data.users
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        putDialog (user) {
            // userDialog open
            this.$refs.userDialog.open(user, '사용자 정보 수정', { color: 'purple' })
                .then(r => {
                    if (r === 'edit success') { // 유저수정 성공
                        this.$store.commit('pop', { msg: '사용자 수정 완료', color: 'success' })
                        this.getUsers()
                    }
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        },
        confirmDelete (id) {
            this.putId = id // 삭제할 아이디를 임시로 담는다.

            this.$refs.confirm.open('정말 삭제하시겠습니까?', '삭제된 데이터는 복구할 수 없습니다.', { color: 'warning' })
                .then((confirm) => {
                    if (confirm) { // true 가 리턴되면 삭제한다.
                        this.delUser()
                    }
                })
        },
        delUser () { // 실제 삭제처리는 여기서
            const dId = this.putId
            this.putId = '' // 비운다
            this.$axios.delete(`manage/user/${dId}`)
                .then(r => {
                    this.$store.commit('pop', { msg: '사용자 삭제 완료', color: 'success' })
                    this.getUsers()
                })
                .catch(e => {
                    if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' })
                })
        }
    }
}
</script>
