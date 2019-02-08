var express = require('express');
var createError = require('http-errors');
var router = express.Router();

// 라우터 모듈 분기
router.use('/test', require('./test')) // test 폴더
router.use('/user', require('./user')) // user 폴더

// 지정된 경로가 아니면 에러를 app.js 의 에러처리 루틴으로 보내버린다.
router.all('*', function(req, res, next) {
  next(createError(404, '그런 api는 없다규'))
});

module.exports = router;
