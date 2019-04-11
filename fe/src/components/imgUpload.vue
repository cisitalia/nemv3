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
            labelButtonProcessItem="업로드해"
            stylePanelLayout="compact"
            allowFileSizeValidation="true"
            maxFileSize="3MB"
            labelMaxFileSizeExceeded="파일사이즈가 너무 큽니다"
            labelMaxFileSize="파일사이즈는 {filesize} 이하여야 합니다"
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

// add : Import filepond-plugin-file-validate-size plugin
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'

// Create component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFileValidateSize)

export default {
    name: 'app',
    data () {
        return {
            myFiles: [],
            server: {
                url: `${this.$apiRootPath}user`,
                process: { // 입력(업로드) : post 메소드로 보낸다
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                },
                revert: { // 삭제 : delete 보내야 한다.
                    url: '/delImg', // 상단 url 뒤에 덧붙여진다. delete 메소드로 보내기 때문세 사실 필요없다!
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
