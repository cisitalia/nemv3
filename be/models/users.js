const mongoose = require('mongoose')
const cfg = require('../../config')

const crypto = require('crypto')

mongoose.set('useCreateIndex', true)

const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    age: { type: Number, default: 1 },
    id: { type: String, default: '', unique: true, index: true },
    pwd: { type: String, default: '' },
    lv: { type: Number, default: 2 },
    inCnt: { type: Number, default: 0 },
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
//         if (!r) return User.create({ id: cfg.admin.id, pwd: cfg.admin.pwd, name: cfg.admin.name, lv: 0 })
//         // if (r.lv === undefined) return User.updateOne({ _id: r._id }, { $set: { lv: 0, inCnt: 0 } }) // 임시.. 관리자 계정 레벨 0으로..
//         return Promise.resolve(r)
//     })
//     .then(r => {
//         // 비밀번호 변경
//         if (r.pwd !== cfg.admin.pwd) return Promise.resolve(null)
//         console.log(`admin:${r.id} created!`)
//         const pwd = crypto.scryptSync(r.pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')
//         return User.updateOne({ _id: r._id }, { $set: { pwd } })
//     })
//     .then(r => {
//         if (r) console.log('pwd changed!')
//     })
//     .catch(e => console.error(e.message))

// 레벨2 유저 생성
// User.findOne({ id: 'lv2' })
//     .then(r => {
//         if (!r) return User.create({ id: 'lv2', pwd: '1234', name: 'lv2', lv: 2 })
//         return Promise.resolve(null)
//     })
//     .then(r => {
//         if (r) console.log(`admin:${r.id} created!`)
//     })
//     .catch(e => console.error(e.message))

// 임시 유저 생성
// User.create({ id: 'test1', pwd: '1234', name: 'test1', lv: 1 })
// User.create({ id: 'test2', pwd: '1234', name: 'test2', lv: 2 })
// User.create({ id: 'test3', pwd: '1234', name: 'test3', lv: 3 })

// 모든 User 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// User.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = User
