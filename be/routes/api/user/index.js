const router = require('express').Router()
const createError = require('http-errors')
const multer = require('multer')
// const imgConvert = require('base64-img') // 이게 필요없다. image-data-uri 를 사용한다.
const sharp = require('sharp')
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

    sharp(req.file.path)
        .resize({
            width: 200,
            height: 200,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy
        })
        .toBuffer()
        .then(bf => {
            fs.unlinkSync(req.file.path)
            const img = imageDataURI.encode(bf, 'png')
            return User.findByIdAndUpdate(req.user._id, { $set: { img } }, { new: true }).select('-img')
            // res.send(imageDataURI.encode(bf, 'png'))
        })
        .then(r => {
            res.setHeader('Content-Type', 'text/plain')
            res.send(r._id.toString())
        })
        .catch(e => next(e))
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
