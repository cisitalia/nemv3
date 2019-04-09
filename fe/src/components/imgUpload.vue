<template>
    <div>
        <file-pond
            name="bin"
            ref="pond"
            allow-multiple="false"
            label-idle="파일을 여기로 끌어놓으세요"
            max-files="1"
            accepted-file-types="image/jpeg, image/png"
            v-bind:files="myFiles"
            :server="server"
            instantUpload="false"
            v-on:init="handleFilePondInit"
            v-on:addfile="handleFileAdded"
            v-on:processfile="onload"
        />
    </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from 'vue-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

// Create component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

export default {
    name: 'app',
    data () {
        return {
            myFiles: [],
            server: {
                url: `${this.$apiRootPath}user`,
                process: {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                },
                revert: {
                    url: '/delImg',
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }
            }
        }
    },
    methods: {
        handleFilePondInit () {
            // console.log('FilePond has initialized')
            // FilePond instance methods are available on `this.$refs.pond`
        },
        handleFileAdded () {
            // console.log('File is added')
        },
        onload (e, r) { // 업로드가 끝나면 이벤트 발생!
            // if (!e.response) this.$store.commit('pop', { msg: e.message, color: 'warning' }) // 에러!
            if (r.fileSize && r.fileSize > 0) {
                this.$emit('upload-complete')
            }
        }
    },
    components: {
        FilePond
    }
}
</script>
