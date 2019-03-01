var express = require('express');
var createError = require('http-errors')
var router = express.Router()

const jwt = require('jsonwebtoken')
const cfg = require('../../../../config')
const User = require('../../../models/users')

// 로그인 토큰 생성 함수
const signToken = (id, age) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ id, age }, cfg.secretKey, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

// /sign/in 으로 들어오는 로그인시 아이디/비번 을 검사하고 토큰을 발행한다.
router.post('/in', (req, res) => {
    const { id, pwd } = req.body
    if (!id) return res.send({ success: false, msg: 'id not found!'})
    if (!pwd) return res.send({ success: false, msg: 'password not found!'})

    User.findOne({ id })
        .then(r => {
            if (!r) throw new Error('존재하지 않는 아이디 입니다.')
            if (r.pwd !== pwd) throw new Error('비밀번호가 틀리네요')
            return signToken(r.id, r.age)
        })
        .then(r => {
            res.send({ success: true, token: r })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message})
        })
})

router.post('/out', (req, res) => {
    res.send({ success: false, msg: '아직 준비 안됨' })
})

// 지정된 경로가 아니면 에러를 app.js 의 에러처리 루틴으로 보내버린다.
router.all('*', function (req, res, next) {
    next(createError(404, '그런 api는 없다규 test'))
});

module.exports = router;
