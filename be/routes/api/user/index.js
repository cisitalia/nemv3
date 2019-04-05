const router = require('express').Router()
const createError = require('http-errors')
const multer = require('multer')

//* 파일 업로드 테스트
// 경로와 콜백사이에 들어가는 'multer({...})' 가 미들웨어다.
router.post('/', multer({ dest: 'public/' }).single('bin'), (req, res, next) => {
    console.log(req.body)
    console.log(req.file)
    res.status(204).send() // 204(콘텐츠 없음): 서버가 요청을 성공적으로 처리했지만 콘텐츠를 제공하지 않는다.
})

/*
const User = require('../../../models/users')

router.get('/', function (req, res, next) {

    // 로그인한 유저의 토큰을 풀어놓은 정보는 req.user에 담겨있다
    // console.log(req.user)

    User.find()
        .then(r => {
            res.send({ success: true, users: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.post('/', (req, res, next) => {
    const { name, age } = req.body
    // const u = new User({ name, age })
    // u.save()
    User.create({ name, age})
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    const { name, age } = req.body
    User.updateOne({ _id: id }, { $set: { name, age }})
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    User.deleteOne({ _id: id })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})
 */

module.exports = router
