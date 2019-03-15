const mongoose = require('mongoose')
// const cfg = require('../../config')

mongoose.set('useCreateIndex', true)

const articleSchema = new mongoose.Schema({
    title: { type: String, default: '', index: true },
    content: { type: String, default: ''},
    cnt: {
        view: { type: Number, default: 0 },
        like: { type: Number, default: 0 }
    },
    ip: { type: String, default: '' },
    comments: [],
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    _board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true }
})

const Article = mongoose.model('Article', articleSchema)

// 모든 Board 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// Article.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = Article
