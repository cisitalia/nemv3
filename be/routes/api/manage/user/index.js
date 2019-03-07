var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const User = require('../../../../models/users')

router.get('/', function (req, res, next) {
    User.find()
        .then(r => {
            res.send({ success: true, users: r })
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    User.updateOne({ _id: id }, { $set: req.body })
        .then(r => {
            res.send({ success: true, msg: r })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    User.deleteOne({ _id: id })
        .then(r => {
            res.send({ success: true, msg: r })
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
