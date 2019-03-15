const mongoose = require('mongoose')
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)

const boardSchema = new mongoose.Schema({
    name: { type: String, default: '', index: true, unique: true },
    lv: { type: Number, default: 0 },
    rmk: { type: String, default: '' },
})

const Board = mongoose.model('Board', boardSchema)

// 모든 Board 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// Board.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = Board
