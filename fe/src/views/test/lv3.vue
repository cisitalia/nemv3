<template>
    <v-container fluid :grid-list-md="!$vuetify.breakpoint.xs">
        <v-layout wrap row>
            <!-- <hello-world/> -->
            <v-flex xs12>
                <editor
                    ref="tuiEditor"
                    v-model="editorText"
                    :options="editorOptions"
                    :visible="editorVisible"
                    :html="editorHtml"
                    height="500px"
                />
            </v-flex>
            <v-flex xs12>
                <viewer
                    :value="editorText"
                    height="500px"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld'

// main.js 에 toast editor 를 전역 컴포넌트로 등록 했으니 필요없다!
// import 'tui-editor/dist/tui-editor.css'
// import 'tui-editor/dist/tui-editor-contents.css'
// import 'codemirror/lib/codemirror.css'
// import { Editor, Viewer } from '@toast-ui/vue-editor'

export default {
    components: {
        // 'hello-world': HelloWorld
        // 'editor': Editor,
        // 'viewer': Viewer
    },
    data: () => ({
        editorText: '# This is initialValue.',
        editorOptions: {
            usageStatistics: false, // 구글 ga 사용안함
            hideModeSwitch: false // switch mode markdown and wysiwyg
        },
        editorHtml: '',
        editorVisible: true
    }),
    mounted () {
    },
    methods: {
        scroll () {
            this.$refs.tuiEditor.invoke('scrollTop', 10)
        },
        moveTop () {
            this.$refs.tuiEditor.invoke('moveCursorToStart')
        }
        // getHtml () {
        //     let html = this.$refs.tuiEditor.invoke('getHtml')
        // }
    }
}
</script>
