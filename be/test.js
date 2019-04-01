const showTime = t => console.log(t)
const echo = showTime

// jwt
// const jwt = require('jsonwebtoken')
// const key = 'veryveryhardkey'

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
// const crypto = require('crypto')

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

// const bf = Buffer.alloc(64)
// const s = crypto.randomFillSync(bf)
// console.log(s.toString('hex'))

///////////////////////////////////////////////////////////////////////
// moment.js test

// const moment = require('moment')
// moment.locale('ko') // 한글화


// console.log(moment())
// console.log(moment().toDate())

// console.log(moment().format('YYMMDD')) // 190314
// console.log(moment().hours()) // 11

// console.log(moment().hours(3).toLocaleString())
// console.log(moment().add(33, 'minutes'.toLocaleString()))

// console.log(moment().fromNow()) // a few seconds ago => 몇 초 전
// console.log(moment().add(-5, 'hours').fromNow()) // 5 hours ago // 5시간 전
// console.log(moment().add(5, 'hours').fromNow()) // in 5 hours // 5시간 후
// console.log(moment().add(-40, 'hours').fromNow()) // 2일 전
// console.log(moment().add(10, 'hours').fromNow()) // 10시간 후

// [중요] 시간비교
// const ct = moment() // 현재시간
// const bt = moment().add(-1, 'hours') // 한시간전

// console.log(ct.diff(bt)) // 3600000
// console.log(ct.diff(bt, 'seconds')) // 3600

// console.log(bt.diff(ct)) // -3600000
// console.log(bt.diff(ct, 'second')) // -3600

// console.log(moment().day(-7))

// console.log(moment().add(40,'hours').format('YYYY-MM-DD'))

// console.log(moment([2015, 25, 35]).format()) //  Invalid date

// console.log(moment().seconds(30).valueOf() === new Date().setSeconds(30))

// showTime(moment().date(15).format('YY-MM-DD'))

// showTime(moment().date(19).month(0).year(2020).format('YYYY.MM.DD'))

// showTime(moment().day(-7))
// showTime(moment().day(0))
// showTime(moment().day(7))

// showTime(moment().day('Sunday'))
// showTime(moment().day('일'))

// 이번주 일 ~ 토 날짜
// showTime(moment().weekday(0)) // 2019-03-10 sunday
// showTime(moment().weekday(1)) // ... 11 monday
// showTime(moment().weekday(2)) // .. 12 tuesday
// showTime(moment().weekday(3))
// showTime(moment().weekday(4))
// showTime(moment().weekday(5))
// showTime(moment().weekday(6))

// showTime(moment().dayOfYear()) // 1년 중 오늘은 며칠째인가 1 ~ 366
// echo(moment().weeks()) // 1년 중 몇번째 주인가

// 윤년 계산따위 걱정없다
// echo(moment('2019-02-28').add(1, 'days').format('YYYY-MM-DD')) // 2019-03-01
// echo(moment('2020-02-28').add(1, 'days').format('YYYY-MM-DD')) // 2020-02-29

// 요일명. 한글화 했기 때문에 한글로 나온다.
// echo(moment.weekdays()) // [ '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' ]
// echo(moment.weekdaysShort()) // [ '일', '월', '화', '수', '목', '금', '토' ]
// echo(moment.weekdaysMin()) // [ '일', '월', '화', '수', '목', '금', '토' ]

// 오늘의 요일 얻기
// echo(moment().day()) // [0 ~ 6]
// echo(moment.weekdays(moment().day())) // 오늘의 요일명 얻기
// echo(moment().format('YYYY-MM-DD HH:mm:ss'))
// 해당 월의 일수 구하기
// echo(moment("2020-02", "YYYY-MM").daysInMonth()) // 29
// echo(moment("2019-01", "YYYY-MM").daysInMonth()) // 31

// toString() 으로 문자열화 하기
// echo(moment().toString())

// toObject() 로 객체로 리턴받기 { years, months, date, hours, minutes, secondes,... }
// echo(moment().toObject())
// echo(moment().toObject().date) // 14

///////////////////////////////////////////////////////////////////////////////////////
// mongoose population test

// connect mongoose
// const mongoose = require('mongoose')
// // config 파일을 읽어온다.
// const cfg = require('../config')
// mongoose.connect(cfg.dbUrl, { useNewUrlParser: true }, err => {
//     if (err) return console.error(err)
//     console.log('mongoose connected!')
// })
// // connect mongoose -- end

// const User = require('./models/users')
// const Board = require('./models/boards')
// const Article = require('./models/articles')

// User.findOne()
//     .then(r => console.log(r.id, r._id)) // rhduddnr 5c85e9af9755c10a5649aabe

// Board.findOne()
//     .then(r => console.log(r.name, r._id)) // test 5c8a2af075f51020f39c3eff

// Article.create({ title: 'aaa', content: 'kkfjf', _user: '5c85e9af9755c10a5649aabe', _board: '5c8a2af075f51020f39c3eff' })
//     .then(r => console.log(r))
/*
{ cnt: { view: 0, like: 0 },
  title: 'aaa',
  content: 'kkfjf',
  ip: '',
  comments: [],
  _id: 5c8a303a6f26242338083766,
  _user: 5c85e9af9755c10a5649aabe,
  _board: 5c8a2af075f51020f39c3eff,
  __v: 0 }
*/

// Article.findOne()
//     .populate('_user', '-pwd') // pwd 만 빼고
//     .then(console.log)

// Article.find({ _board: '5c8a2af075f51020f39c3eff' })
//     .populate('_user', 'name')
//     .populate('_board')
//     .then(r => console.log(r.length))

///////////////////////////////////////////////////////////////////////////////////////
// js string - '[ERR01-TOKEN] jwt expired' 문자열 검사

// const str = '[ERR01-TOKEN] jwt expired'
// if (str.indexOf('ERR01-TOKEN') !== -1 || str.indexOf('jwt expired') !== -1) {
//     console.log('찾았다')
// }
// echo(str.indexOf('ERR01-TOKEN'))
// echo(str.indexOf('jwt expired'))
// echo(str.indexOf('test'))

// echo(str.includes('jwt'))

///////////////////////////////////////////////////////////////////////////////////////
// * 프라미스로 일으키는 실패(reject)는 에러가 아니다!
// 이 점을 분명히 알고 있어야 겠다.
// 프라미스의 reject 는 개발자가 의도한 에러이다.
// 정확히는 에러로 처리할 수도 있고 => reject(new Error('error!!!'))
// 그냥 resolve() 가 아닌 else 상황이기도 하다.
// resolve(1), reject(1) 는 둘다 1을 리턴한다. 즉, 상황에 따라 던지는 값일 뿐이다.
const et = (a) => {
    return new Promise((resolve, reject) => {
        if (a >= 20) {
            // resolve(1)
            resolve(true)
        }
        // reject(new Error('error!!!')) // 에러를 던지거나
        // reject(1)
        reject('error! - invalid value : ' + a) // 임의의 값을 던지거나
    })
}
et(20).then(echo).catch(e => echo(e)) // true
et(10).then(echo).catch(e => echo(e)) // error! - invalid value : 10
et(10).then(echo).catch(echo) // 더 간단히 : error! - invalid value : 10
