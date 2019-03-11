var express = require('express');
var createError = require('http-errors')
var router = express.Router()

const crypto = require('crypto')

const User = require('../../../models/users')

router.post('/', (req, res) => {
    const u = req.body
    if (!u.id) return res.send({ success: false, msg: '아이디가 없습니다'})
    if (!u.pwd) return res.send({ success: false, msg: '비밀번호가 없습니다'})
    if (!u.name) return res.send({ success: false, msg: '이름이 없습니다'})

    // >> async ~ await 방식 : 훨씬 간결하다
    User.findOne({ id: u.id }).then(async r => {
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

// 지정된 경로가 아니면 에러를 app.js 의 에러처리 루틴으로 보내버린다.
router.all('*', function (req, res, next) {
    next(createError(404, '그런 api는 없다규 test'))
});

module.exports = router;
