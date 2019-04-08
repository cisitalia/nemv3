<template>
    <v-container fluid fill-height grid-list-md>
        <v-layout wrap row justify-center>
            <v-flex xs12 sm6 md6>
                <v-card class="elevation-12" height="100%">
                    <v-card-title class="subheading grey--text text--lighten-1">회원 정보 수정</v-card-title>
                    <v-card-text>
                        <img-upload />
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6 md6>
                <v-card class="elevation-12" height="100%">
                    <v-card-title class="subheading grey--text text--lighten-1">트리 뷰 테스트</v-card-title>
                    <v-card-text>
                        <template>
                            <v-treeview :items="items"></v-treeview>
                        </template>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-card class="elevation-12" height="100%">
                    <v-card-title class="subheading grey--text text--lighten-1">회원 정보</v-card-title>
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
    </v-container>
</template>

<script>
import imgUpload from '@/components/imgUpload'

export default {
    components: { imgUpload },
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
    },
    methods: {
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
