const router = require('express').Router()
const createError = require('http-errors')
const multer = require('multer')
const sharp = require('sharp')
// const imgConvert = require('base64-img') // 이게 필요없다. image-data-uri 를 사용한다.
const imageDataURI = require('image-data-uri')
const fs = require('fs')

const User = require('../../../models/users')

//* 유저정보 수정 :: 유저 이미지 파일 업로드
// 경로와 콜백사이에 들어가는 'multer({...})' 가 미들웨어다.
router.post('/', multer({ dest: 'public/' }).single('bin'), (req, res, next) => {
    if (!req.user._id) throw createError(401, 'xxx')

    // console.log(req.body)
    // console.log(req.file)

    // const fn = req.file.path + 'sharp'
    // sharp(req.file.path).resize(200,200).crop(sharp.strategy.entropy).toFile(fn, (err, info) => {
    //   if (err) return next(err)
    //   imgConvert.base64(fn, (err, fd) => {
    //     if (err) return next(err)
    //     fs.unlinkSync(req.file.path)
    //     fs.unlinkSync(fn)
    //     console.log(fd.length)
    //     res.send(fd.toString())
    //   })
    // })

    sharp(req.file.path) // multer로 넘겨받은 이미지 파일을 sharp 로 사이즈 축소 후 버퍼로 내보냄
        .resize({
            width: 200,
            height: 200,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy
        })
        .toBuffer()
        .then(bf => {
            fs.unlinkSync(req.file.path) // 이제 원본 이미지파일은 없애자
            const img = imageDataURI.encode(bf, 'png') // 이미지(버퍼)를 base64 로 인코딩(png 타입) 하면 문자열로 변환됨
            return User.findByIdAndUpdate(req.user._id, { $set: { img } }, { new: true }).select('-img')
            // res.send(imageDataURI.encode(bf, 'png'))
        })
        .then(r => {
            // 돌려주는 데이터는 평문(text/plain)으로 해야하며, filepond 가 사용하는 고유키가 된다.(삭제,수정용)
            // r._id 는 고유값이므로 이를 문자열로 인코딩해서 돌려주면 된다.
            res.setHeader('Content-Type', 'text/plain')
            res.send(r._id.toString())
        })
        .catch(e => next(e))
})

// 로그인한 유저의 이미지 가져오기
// 여기서는 굳이 url에 이름을 지정했지만 get 메소드로만 보내와도 되므로 '/'만 해도 된다.
router.get('/getImg', function (req, res, next) {
    if (!req.user._id) throw createError(401, 'xxx')

    User.findById(req.user._id).select('img')
        .then(r => {
            res.send({ success: true, user: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

// 이미지 삭제 - 로그인한 유저의 이미지를 삭제한다(실제로는 업데이트)
// 여기서도 delete메소드로 보내오기 때문에 '/'만 있어도 된다.
router.delete('/delImg', (req, res, next) => {
    if (!req.user._id) throw createError(401, 'xxx')

    // 유저 이미지 필드를 '' 로 만든다.
    User.findByIdAndUpdate(req.user._id, { $set: { img: '' } }, { new: true }).select('-img')
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
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
