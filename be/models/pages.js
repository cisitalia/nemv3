const mongoose = require('mongoose')
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)

const pageSchema = new mongoose.Schema({
    name: { type: String, default: '', index: true },
    inCnt: { type: Number, default: 0 },
    lv: { type: Number, default: 0 }
})

const Page = mongoose.model('Page', pageSchema)

// 모든 Page 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// Page.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = Page
