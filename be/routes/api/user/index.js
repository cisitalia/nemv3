var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const us = [
    {
        name: '김김김',
        age: 14
    },
    {
        name: '이이이',
        age: 24
    }
]

router.get('/', function (req, res, next) {
    console.log(req.query)
    console.log(req.body)
    res.send({ users: us })
})

router.post('/', (req, res, next) => {
    console.log(req.query)
    console.log(req.body)
    res.send({ success: true, msg: 'post ok' })
})

router.put('/', (req, res, next) => {
    console.log(req.query)
    console.log(req.body)
    res.send({ success: true, msg: 'put ok' })
})

router.delete('/', (req, res, next) => {
    console.log(req.query)
    console.log(req.body)
    res.send({ success: true, msg: 'del ok' })
})

// 지정된 경로가 아니면 에러를 app.js 의 에러처리 루틴으로 보내버린다.
router.all('*', function(req, res, next) {
  next(createError(404, '그런 api는 없다규 test'))
});

module.exports = router;
