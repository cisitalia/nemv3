const router = require('express').Router()
const createError = require('http-errors')

const crypto = require('crypto')

const User = require('../../../models/users')

router.post('/', (req, res) => {
    const u = req.body
    if (!u.id) throw createError(400, '아이디가 없습니다')
    if (!u.pwd) throw createError(400, '비밀번호가 없습니다')
    if (!u.name) throw createError(400, '이름이 없습니다.')

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

module.exports = router;
