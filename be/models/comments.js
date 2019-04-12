const mongoose = require('mongoose')
// const cfg = require('../../config')

mongoose.set('useCreateIndex', true)

const commentSchema = new mongoose.Schema({
    content: { type: String, default: ''},
    cnt: {
        view: { type: Number, default: 0 },
        like: { type: Number, default: 0 }
    },
    ip: { type: String, default: '' },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
    _article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', index: true }
})

const Comment = mongoose.model('Comment', commentSchema)

// 모든 Board 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// Article.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = Comment
