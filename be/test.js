// jwt
const jwt = require('jsonwebtoken')
const key = 'veryveryhardkey'

/*
const signToken = (id, lv, name) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id, lv, name }, key, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}
*/
/*
// async ~ await 로 바꾼 것
const signToken = async (id, lv, name) => {
    try {
        const token = await jwt.sign({ id, lv, name }, key)
        if(!token) throw new Error('token not made')
        return token
    } catch (e) {
        console.error(e.message)
    }
}

signToken('test1', '2', 'test1').then(console.log)
 */

/*
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
 */

 ///////////////////////////////////////////////////////////////////////
/*
 const asyncTest = async (i) => {
     if (i > 10) throw new Error('not valid!')
     return i + 3
 }

 asyncTest(3)
    .then(r => console.log(r))
    .catch(e => console.error(e.message))
 */

 ///////////////////////////////////////////////////////////////////////
/*
// 프로미스 주의점 테스트
 const tt = (p1, p2) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (p1 === '' || p2 === '') reject(new Error('error'))
            resolve(p1 + p2)
        }, 1000)
    })
}

const tt2 = () => {
    // return { res: tt(1, 2) } // 객체를 리턴하는 경우. 프로미스는 제대로 동작하지 못함
    return tt(1, 2)
}

// tt(1,2).then(console.log) // 성공

// tt2().then(console.log) // error!
// console.log(tt2()) // pending 걸림. error나 다름없다.

// 아래처럼 아무리 체인을 만들어봐야 안된다.
// return { res: r } 는 비동기와 상관없이 실행되므로 <pending> 된다.
const res3 = tt2()
                .then(r => {
                    // console.log(r)
                    // return r * 3
                    const result = { res: r * 3 }
                    console.log(result)
                })
                // .then(r => {
                //     // return { res: r } // 의미없다.
                //     console.log({ res: r })
                // })

// console.log(res3) // 무조건 <pending>
 */

 ///////////////////////////////////////////////////////////////////////
 // 암호화 테스트
const crypto = require('crypto')

 // Using the factory defaults
// const key1 = crypto.scryptSync('secret', 'salt', 64)
// console.log(key1.toString('hex'))
// const key2 = crypto.scryptSync('secret', 'salt', 64, { N: 1024 })
// console.log(key2.toString('hex'))

// const registPwd = '1234' // 회원가입시 저장된 비번
// const dbPwd = crypto.scryptSync(registPwd, 'salt', 64, { N: 1024 }).toString('hex') // 암호화된 문자를 db에 저장
// const inputPwd = '1234' // 로그인시 12345 로 치고 들어옴(틀린 비번)
// const userPwd = crypto.scryptSync(inputPwd, 'salt', 64, { N: 1024 }).toString('hex') // 암호화된 문자열로 변경
// if (userPwd === dbPwd) console.log('비번 같음')
// else console.log('비번이 틀리네')

// 소금 뿌리기
// const dbPwd = crypto.scryptSync('1234', '소금1', 64, { N: 1024 }).toString('hex') // 암호화된 문자를 db에 저장
// const dbPwd2 = crypto.scryptSync('1234', '소금2', 64, { N: 1024 }).toString('hex') // 암호화된 문자를 db에 저장
// console.log(dbPwd)
// console.log(dbPwd2)

const bf = Buffer.alloc(64)
const s = crypto.randomFillSync(bf)
console.log(s.toString('hex'))
