var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const Site = require('../../../../models/sites')

router.get('/', function (req, res, next) {
    Site.find()
        .then(r => {
            res.send({ success: true, sites: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false })
        })
})

router.put('/:_id', (req, res, next) => {
    const _id = req.params._id
    Site.updateOne({ _id }, { $set: req.body })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:_id', (req, res, next) => {
    const _id = req.params._id
    Site.deleteOne({ _id })
        .then(r => {
            res.send({ success: true, msg: r, token: req.token })
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
