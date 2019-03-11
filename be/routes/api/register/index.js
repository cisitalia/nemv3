var express = require('express');
var createError = require('http-errors')
var router = express.Router()

const User = require('../../../models/users')

router.post('/', (req, res) => {
    const u = req.body
    if (!u.id) return res.send({ success: false, msg: '아이디가 없습니다'})
    if (!u.pwd) return res.send({ success: false, msg: '비밀번호가 없습니다'})
    if (!u.name) return res.send({ success: false, msg: '이름이 없습니다'})

    // >> async ~ await 방식 : 훨씬 간결하다
    User.findOne({ id: u.id }).then(async r => {
            if (r) throw new Error('이미 등록된 아이디 입니다.')

            User.create(u) // 이렇게 편하게 되다니!

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
