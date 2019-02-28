// jwt
const jwt = require('jsonwebtoken')
const key = 'veryveryhardkey'

const User = require('./models/users')

// connect mongoose
const mongoose = require('mongoose')
// config 파일을 읽어온다.
const cfg = require('../config')
mongoose.connect(cfg.dbUrl, { useNewUrlParser: true }, err => {
    if (err) return console.error(err)
    console.log('mongoose connected!')
})
// connect mongoose -- end

const signToken = (u, k) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ name: u.name, age: u.age }, k, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyToken = (t, k) => {
    return new Promise((resolve, reject) => {
        jwt.verify(t, k, (err, v) => {
            if (err) reject(err)
            resolve(v)
        })
    })
}

// const getToken = async (key) => {
//     let token = await signToken({ name: 'rhduddnr', age: 33 }, key)
//     console.log(token)

//     let decoded = await verifyToken(token, key)
//     console.log(decoded)
// }

const getToken = async (name) => {
    let u = await User.findOne({ name: name })
    if (!u) u = await User.create({ name: name, age: 10 })
    console.log(u.name, ' ', u.age)

    if (u.age > 12) throw new Error(`${u.age} is too old`)

    const ur = await User.updateOne({ _id: u._id }, { $inc: { age: 1 }})
    if (!ur.nModified) throw new Error('수정된 것이 없네요')
    u = await User.findOne({ _id: u._id })
    console.log(u.name, ' ', u.age)

    const token = await signToken(u, key)
    const v = await verifyToken(token, key)
    return v
}

getToken('aaa')
    .then(console.log)
    .catch(e => console.log(e.message))

// mongoose.findOne() 메소드를 wrap 하는 함수를 만든다.
// 비동기로 동작하며 이름을 던지면 비동기로 작업 후 프라미스를 리턴한다.
const findOneUser = async name => {
    return await User.findOne({ name: name })
}
findOneUser('aaa').then(console.log)

