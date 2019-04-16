<template>
    <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs">
        <v-layout wrap row>
            <v-flex xs12 sm6 md3 class="pb-2">
                <small-card
                    :title="latest.title"
                    :number="latest.number"
                    :tIcon="latest.tIcon"
                    :tIconColor="latest.tIconColor"
                    :bIcon="latest.bIcon"
                    :bIconColor="latest.bIconColor"
                    :bText="latest.bText"
                ></small-card>
            </v-flex>
            <v-flex xs12 sm6 md3 class="pb-2">
                <small-card
                    title="전체 사용자"
                    number="12"
                    tIcon="person"
                    tIconColor="primary"
                    bIcon="group"
                    bIconColor="success"
                    bText="2명 접속중"
                ></small-card>
            </v-flex>
            <v-flex xs12 sm6 md3 class="pb-2">
                <small-card
                    title="전체 조회수"
                    number="431"
                    tIcon="visibility"
                    tIconColor="info"
                    bIcon="trending_down"
                    bIconColor="error"
                    bText="43 감소"
                ></small-card>
            </v-flex>
            <v-flex xs12 sm6 md3 class="pb-2">
                <small-card
                    title="전체 게시물"
                    number="334234"
                    tIcon="view_module"
                    tIconColor="warning"
                    bIcon="trending_up"
                    bIconColor="success"
                    bText="256 증가"
                ></small-card>
            </v-flex>

            <v-flex xs12 sm4 class="pb-2">
                <trend-card
                    title="주간 게시물 현황"
                    :data="[4, 7, 9, 5, 6, 4, 5]"
                    :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                ></trend-card>
            </v-flex>
            <v-flex xs12 sm4 class="pb-2">
                <trend-card
                    title="주간 사용자 현황"
                    :data="[3, 1, 2, 1, 0, 4, 2]"
                    :gradient="['red', 'orange', 'yellow']"
                ></trend-card>
            </v-flex>
            <v-flex xs12 sm4 class="pb-2">
                <trend-card
                    title="주간 조회수 현황"
                    :data="[33, 22, 2, 43, 33, 1, 55]"
                    :gradient="['blue', 'green', 'sky']"
                ></trend-card>
            </v-flex>

            <v-flex xs12 sm6 class="pb-2">
                <link-card></link-card>
            </v-flex>
            <v-flex xs12 sm6 class="pb-2">
                <board-card></board-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import smallCard from '@/components/dashboard/smallCard'
import trendCard from '@/components/dashboard/trendCard'
import linkCard from '@/components/dashboard/linkCard'
import boardCard from '@/components/dashboard/boardCard'

export default {
    components: {
        smallCard,
        trendCard,
        boardCard,
        linkCard
    },
    data: () => ({
        latest: { // 최근게시물 초기값
            title: '최근 게시물s',
            number: '0',
            tIcon: 'list',
            tIconColor: 'success',
            bIcon: 'update',
            bIconColor: 'primary',
            bText: ''
        }
    }),
    computed: {
    },
    methods: {
        getLatest () { // 최근 게시물
            // 최근 게시물 정보를 가져오는 api 로 부터 데이터를 가져온다!
            this.latest.number = 333
            this.latest.bText = '3 시간 전'
        }
    },
    mounted () {
        this.getLatest()
        // console.log(this.$util.moduleTest())
    }
}
</script>
