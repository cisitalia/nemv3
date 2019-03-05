var express = require('express');
var createError = require('http-errors');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.send({ msg: 'test', a: 22222 })
    console.log(req.headers)
    res.send({ msg: 'hello', a: 'welcome!' })

});

router.get('/hello', function (req, res, next) {
    res.send({ msg: 'test hello', a: 22222 })
});


// 지정된 경로가 아니면 에러를 app.js 의 에러처리 루틴으로 보내버린다.
router.all('*', function(req, res, next) {
  next(createError(404, '그런 api는 없다규 test'))
});

module.exports = router;
