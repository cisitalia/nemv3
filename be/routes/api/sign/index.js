const createError = require('http-errors')
const router = require('express').Router()

const crypto = require('crypto')
const request = require('request')
const jwt = require('jsonwebtoken')

const cfg = require('../../../../config')
const User = require('../../../models/users')

// 로그인 토큰 생성 함수
// [2019.3.5] id, lv, name 으로 변경
// [2019.3.14] rmb(remember) 추가. 토큰갱신 기능 붙임
const signToken = (_id, id, lv, name, rmb) => {
    return new Promise((resolve, reject) => {
        const o = {
            issuer: cfg.jwt.issuer,
            subject: cfg.jwt.subject,
            expiresIn: cfg.jwt.expiresIn, // 3분
            algorithm: cfg.jwt.algorithm
        }
        if (rmb) o.expiresIn = cfg.jwt.expiresInRemember // 6일 보관
        jwt.sign({ _id, id, lv, name }, cfg.jwt.secretKey, o, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

// /sign/in 으로 들어오는 로그인시 아이디/비번/레벨 을 검사하고 토큰을 발행한다.
router.post('/in', (req, res, next) => {
    // fs.readFile('a') // 500 인터널 서버 에러를 테스트 하기 위한 코드
    const { id, pwd, remember } = req.body
    if (!id) throw createError(400, '아이디가 없습니다')
    if (!pwd) throw createError(400, '비밀번호가 없습니다')
    if (remember === undefined) throw createError(400, '기억하기가 없습니다.')

    // >> async ~ await 방식 : 훨씬 간결하다
    // 몽구스 lean() 함수 : plain JSON 문자열을 리턴한다.
    // 몽구스에서 받은 결과 객체는 변경할 수 없기 때문에 lean() 으로 받았다.
    User.findOne({ id }).lean()
        .then(async r => {
            if (!r) throw new Error('존재하지 않는 아이디 입니다.')
            const p = await (crypto.scryptSync(pwd, r._id.toString(), 64, { N: 1024 }).toString('hex')) // 비번풀기
            if (r.pwd !== p) throw new Error('비밀번호가 틀립니다')

            delete r.pwd // pwd삭제. lean() 으로 받은 객체이므로 삭제가능하다.

            // const ui = { id: r.id, name: r.name, lv: r.lv, age: r.age } // 커스텀으로 추가한 유저정보
            const ui = r // 유저 정보를 저장한다.

            // 리턴할 토큰
            const token = await signToken(r._id, r.id, r.lv, r.name, remember)

            // res.send({ success: true, token: token, ui: ui })
            res.send({ success: true, token: token, user: ui })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
            // next(createError(401, e.massage))
        })

    /*
    // >> 프로미스 방식 : 맘에 안들어 주석처리
    // 유저정보를 패칭하는 객체. 프로미스의 단점이 프로미스 체인안에서 사용할 수 있는 인자가 한계가 있으므로
    // 외부 변수를 써야 한다. 이를 극복하려면 async ~ await 를 써야 함
    let ui = {}
    User.findOne({ id })
        .then(r => {
            if (!r) throw new Error('존재하지 않는 아이디 입니다.')
            if (r.pwd !== pwd) throw new Error('비밀번호가 틀리네요')

            // ! 객체에 넣어서 리턴하면 비동기(프라미스)가 적용되지 않는다!
            // return { token: signToken(r.id, r.lv, r.name) } 식으로 보내면 비동기 적용이 안된다.
            // 객체 자체가 리턴되버리고 아직 해결되지 않은 프로미스 때문에 <pending> 상태로 보낸다.

            // 프로미스에서 프로미스 자신말고 무언가를 조작해서 리턴해 써먹을 생각을 버려야 한다

            // 따로 보내기 위해 여기서 유저정보용 객체를 생성한다.
            ui = { id: r.id, name: r.name, lv: r.lv, age: r.age }

            return signToken(r.id, r.lv, r.name)
        })
        // .then(r => {
        //     // 객체를 만들어 보내려면 이렇게 then 을 하나 더 넣어줘야 함. 그러나 의미없음.
        //     return { success: true, token: r, ui: ui }
        // })
        .then(r => {
            // 기존 코드
            // res.send({ success: true, token: r })

            // 토큰과 유저정보를 함께 보낸다.
            res.send({ success: true, token: r, ui: ui })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message})
        })
    */
})

// 기존 회원가입의 register 를 /sign/up 으로 변경
// 구글 리캡챠 적용
router.post('/up', (req, res, next) => {
    const u = req.body
    if (!u.id) throw createError(400, '아이디가 없습니다')
    if (!u.pwd) throw createError(400, '비밀번호가 없습니다')
    if (!u.name) throw createError(400, '이름이 없습니다.')
    if (!u.response) throw createError(400, '로봇 검증이 없습니다')

    const ro = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        json: true,
        form: {
            secret: cfg.recaptchaSecretKey,
            response: u.response,
            remoteip: req.ip
        }
    }

    request.post(ro, (err, response, body) => {
        if (err) throw createError(401, '로봇 검증 실패입니다')

        // >> async ~ await 방식 : 훨씬 간결하다
        User.findOne({ id: u.id })
            .then(async r => {
                if (r) throw new Error('이미 등록된 아이디 입니다.')

                // 새로운 유저 등록
                const ru = await User.create(u) // 이렇게 편하게 되다니!

                // crypto 모듈로 비밀번호 암호화하여 업데이트 : 아이디를 소금(salt)로 하여 저장
                const pwd = await (crypto.scryptSync(ru.pwd, ru._id.toString(), 64, { N: 1024 }).toString('hex'))
                await User.updateOne({ _id: ru._id }, { $set: { pwd } })

                res.send({ success: true })
            })
            .catch(e => {
                res.send({ success: false, msg: e.message })
            })
    })
})

module.exports = router;
