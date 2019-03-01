const mongoose = require('mongoose')
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    age: { type: Number, default: 1 },
    id: { type: String, default: '', unique: true, index: true },
    pwd: { type: String, default: '' },
    retry: { type: Number, default: 0 }
})

const User = mongoose.model('User', userSchema)

// 기존에 name이 unique: true 였기 때문에 인덱스를 초기화 하지 않으면 중복에러가 난다
// 초기화 yarn dev 후 주석처리한다.
// User.collection.dropIndexes({ name: 1 })

// 관리자를 찾고 없으면 생성한다. 일단 찾으면 return null 로 이후의 프로미스체인에 넘기지 않는다.
// 초기에 딱 한번만 실행되며 이후 주석처리하자
// User.findOne({ id: cfg.admin.id })
//     .then(r => {
//         if (!r) return User.create({ id: cfg.admin.id, pwd: cfg.admin.pwd, name: cfg.admin.name })
//         return Promise.resolve(null)
//     })
//     .then(r => {
//         if (r) console.log(`admin:${r.id} created!`)
//     })
//     .catch(e => console.error(e.message))

// 모든 User 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// User.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = User
