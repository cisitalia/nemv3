<template>
    <!-- {{ this.$vuetify.breakpoint }} -->
    <div>
        <v-toolbar dark color="primary">
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">Title</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>more_vert</v-icon></v-btn>
        </v-toolbar>
        <v-container
            id="grid"
            fluid
            grid-list-sm
            tag="section">
            <v-layout row wrap>
                <v-flex tag="h1" class="headline">Using Tag</v-flex>
                <v-flex d-flex xs12 order-xs5>
                    <v-layout column>
                        <v-flex>
                            <v-card flat>
                                <v-card-text>{{ lorem }}</v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex>
                            <v-card flat>
                                <v-card-text>{{ lorem }}</v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
        <v-divider></v-divider>

        <v-container>
            <v-layout>
                <v-flex xs12 sm6 offset-sm3>
                    <v-card>
                        <v-toolbar flat>
                            <v-btn icon>
                                <v-icon>arrow_back</v-icon>
                            </v-btn>
                            <v-toolbar-title>Albums</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>search</v-icon>
                            </v-btn>
                        </v-toolbar>

                        <v-card-actions>
                            <v-select v-model="size" :items="items" label="Size"></v-select>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                        <v-subheader>Random Images</v-subheader>

                        <v-container fluid v-bind="{ [`grid-list-${size}`]: true }">
                            <v-layout row wrap>
                                <v-flex
                                    v-for="n in 9"
                                    :key="n"
                                    xs4
                                >
                                    <v-card title>
                                        <v-img
                                            :src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
                                            :lazy-src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
                                            aspect-ratio="1"
                                            class="grey lighten-2"
                                            height="150px"
                                        >
                                        <v-layout
                                            slot="placeholder"
                                            fill-height
                                            align-center
                                            justify-center
                                            ma-0
                                        >
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-layout>
                                    </v-img>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-flex>
            </v-layout>

            <v-btn
                color="pink"
                dark
                small
                absolute
                bottom
                right
                fab
                @click="anyAction"
            >
                <v-icon>add</v-icon>
            </v-btn>

            <div>{{ a }}</div>
            <div>{{ b }}</div>
            <div>{{ aPlusBm() }}</div>
            <div>{{ aPlusBc }}</div>

        </v-container>
    </div>
</template>

<script>
export default {
    data: () => ({
        lorem: `11일 한국국학진흥원이 '양반의 식도락'을 소재로 스토리테마파크 웹진 '담談' 2월호를 발행했다.
        한국국학진흥원에 따르면 사계절이 뚜렷한 기후적 환경과 3면이 바다로 둘러싸이고 산과 평야가 어우러진 지리적 환경 덕분에 우리나라 먹거리는 예로부터 다양하고 풍성했다.
        특히 경제적으로 여유가 있던 조선시대 양반들은 계절과 날씨, 분위기 등에 따라 그에 어울리는 음식을 찾아 즐겼다.`,
        size: 'sm',
        items: [
            { text: 'Extra small (2px)', value: 'xs' },
            { text: 'Small (4px)', value: 'sm' },
            { text: 'Medium (8px)', value: 'md' },
            { text: 'Large (16px)', value: 'lg' },
            { text: 'Extra large (24px)', value: 'xl' }
        ],
        a: 1,
        b: 2
    }),
    watch: {
        a () {
            console.log('change')
        }
    },
    methods: {
        aPlusBm () {
            return this.a + this.b
        },
        anyAction () {
            this.a = 5
            // console.log(this.aPlusBm())
            console.log(this.aPlusBc)
        }
    },
    computed: {
        aPlusBc () {
            return this.a + this.b
        }
    },
    mounted () {
        console.log(this.a + this.b)
        console.log(this.aPlusBm())
        console.log(this.aPlusBc)
    }
}
</script>
