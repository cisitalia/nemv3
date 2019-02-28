var express = require('express');
var createError = require('http-errors');
var router = express.Router();

// 미들웨어 - 미들웨어는 별거없다.
// 라우터 타고 들어오는 경로의 중간에 먼저 실행할 것이 있으면
// 미들웨어를 거쳐 실행하고 next()로 원래의 경로로 보낸다.
router.all('*', (req, res, next) => {
    console.log(req.headers)
    console.log('> ' + req.path)
    next()
})

// 라우터 모듈 분기
router.use('/test', require('./test')) // test 폴더
router.use('/user', require('./user')) // user 폴더
router.use('/sign', require('./sign')) // sign 폴더

// app.js 에서 app.use('/api', require('./routes/api')) 로 보내고 있으니
// 위의 라우트 모듈 분기에 따라
// /api/test/~
// /api/user/~
// 위 두가지 경우가 아니면 없는 경로이므로 에러가난다.
// 에러가 난 경우 다시 app.js 의 에러처리 루틴으로 보내버린다.
router.all('*', function(req, res, next) {
  next(createError(404, '그런 api는 없다규'))
});

module.exports = router;
