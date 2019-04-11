<template>
    <v-container fluid fill-height grid-list-md>
        <v-layout wrap row justify-center>
            <v-flex xs12 sm6 md6>
                <v-card class="elevation-12" height="100%">
                    <v-card-title class="subheading grey--text text--lighten-1">회원 정보 수정</v-card-title>
                    <v-card-text>
                        <template v-if="$store.state.user.img === ''">
                            <img-upload
                                @upload-complete="uploadComplete"
                            />
                        </template>
                        <template v-else>
                            <v-avatar
                                tile
                                size="150"
                                color="grey lighten-4"
                                class="elevation-12"
                            >
                                <v-img :src="$store.state.user.img"></v-img>
                                <v-btn fab dark small absolute bottom right color="primary" @click.native="confirmDelete">
                                    <v-icon dark>delete</v-icon>
                                </v-btn>
                            </v-avatar>
                            <!-- <v-btn icon dark small color="primary" @click.native="confirmDelete">
                                <v-icon dark>highlight_off</v-icon>
                            </v-btn> -->
                        </template>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md6>
                <v-card class="elevation-12" height="100%">
                    <v-card-title class="subheading grey--text text--lighten-1">v-treeview 테스트</v-card-title>
                    <v-card-text>
                        <template>
                            <v-treeview :items="items"></v-treeview>
                        </template>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-card class="elevation-12" height="100%">
                    <v-card-title class="subheading grey--text text--lighten-1">v-sparkline 테스트</v-card-title>
                    <v-card-text>
                        <v-sparkline
                            :value="sparklineVal"
                            :gradient="gradient"
                            :smooth="radius"
                            :padding="padding"
                            :line-width="width"
                            stroke-linecap="round"
                            gradient-direction="top"
                            auto-draw
                        ></v-sparkline>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>

        <confirm ref="confirm" @sendConfirmDelete="confirmDelete"></confirm>

    </v-container>
</template>

<script>
import imgUpload from '@/components/imgUpload'
import confirm from '@/components/confirm'

export default {
    components: { imgUpload, confirm },
    data: () => ({
        // data for v-sparkline
        width: 2,
        radius: 10,
        padding: 8,
        gradient: ['#00c6ff', '#F0F', '#FF0'],
        sparklineVal: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
        // data for v-treeview
        items: [
            {
                id: 1,
                name: 'Applications :',
                children: [
                    { id: 2, name: 'Calendar : app' },
                    { id: 3, name: 'Chrome : app' },
                    { id: 4, name: 'Webstorm : app' }
                ]
            },
            {
                id: 5,
                name: 'Documents :',
                children: [
                    {
                        id: 6,
                        name: 'vuetify :',
                        children: [
                            {
                                id: 7,
                                name: 'src :',
                                children: [
                                    { id: 8, name: 'index : ts' },
                                    { id: 9, name: 'bootstrap : ts' }
                                ]
                            }
                        ]
                    },
                    {
                        id: 10,
                        name: 'material2 :',
                        children: [
                            {
                                id: 11,
                                name: 'src :',
                                children: [
                                    { id: 12, name: 'v-btn : ts' },
                                    { id: 13, name: 'v-card : ts' },
                                    { id: 14, name: 'v-window : ts' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
        // , img: 'http://medfordgospelmission.org/wp-content/uploads/2018/06/default-user-image-female.png'
    }),
    mounted () {
        // console.log('user>>> ', this.$store.state.user.img)
    },
    methods: {
        delImg () {
            // 유저 이미지 삭제 - 실제로는 디비 업데이트 이지만 filepond api 지원이 안되서..
            this.$axios.delete(`/user/delImg`)
                .then(({ data }) => {
                    // console.log(data)
                    // 로컬스토리지와 스토어 이미지 갱신 - 스토어는 뮤테이션으로 해야 함
                    localStorage.setItem('uImg', '')
                    this.$store.commit('getUserInfo')

                    this.$store.commit('pop', { msg: '유저 이미지 삭제 완료', color: 'success' })
                })
                .catch(e => {
                    if (e.repsonse) this.$store.commit('pop', { msg: '유저 이미지 삭제 실패', color: 'error' })
                })
        },
        uploadComplete () {
            // console.log('upload complete')

            // 업로드가 완료되면 유저의 이미지를 가져온다!
            // 약간의 로딩 ??
            this.getImg()
        },
        // 로그인한 유저의 이미지 가져오기
        getImg () {
            this.$axios.get(`/user/getImg`)
                .then(({ data }) => {
                    // console.log(data.user.img)
                    // 로컬스토리지와 스토어 이미지 갱신 - 스토어는 뮤테이션으로 해야 함
                    localStorage.setItem('uImg', data.user.img)
                    this.$store.commit('getUserInfo')
                })
                .catch(e => {
                    if (e.repsonse) this.$store.commit('pop', { msg: '유저 이미지 가져오기 실패', color: 'error' })
                })
        },
        confirmDelete () {
            this.$refs.confirm.open('정말 삭제하시겠습니까?', '삭제된 데이터는 복구할 수 없습니다.', { color: 'warning' })
                .then((confirm) => {
                    if (confirm) { // true 가 리턴되면 삭제한다.
                        this.delImg()
                    }
                })
        }

        // upload () {
        //     const fd = new FormData()

        //     fd.append('name', this.form.name)
        //     fd.append('bin', document.getElementById('bin').files[0])
        //     this.$axios.post('/user', fd)
        //         .then(({ data }) => {
        //             this.img = data
        //             this.$store.commit('pop', { msg: '파일 업로드 완료', color: 'success' })
        //         })
        //         .catch(e => {
        //             if (e.repsonse) this.$store.commit('pop', { msg: '파일 업로드 실패', color: 'error' })
        //         })
        // }
    }
}
</script>
