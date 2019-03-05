var express = require('express');
var createError = require('http-errors');
var router = express.Router();

const jwt = require('jsonwebtoken')
const cfg = require('../../../config')

//////////////////////////////////////////////////////////////
// 미들웨어 - 미들웨어는 별거없다.
// 라우터 타고 들어오는 경로의 중간에 먼저 실행할 것이 있으면
// 미들웨어를 거쳐 실행하고 next()로 원래의 경로로 보낸다.
// router.all('*', (req, res, next) => {
    // console.log(req.headers)
    // console.log(req.path)
    // next()
// })
//////////////////////////////////////////////////////////////

// 로그인시 아이디/비번 검사 & 토큰발행하는 sign 모듈사용
// /sign/in 으로 들어오는 로그인을 처리한다.
router.use('/sign', require('./sign')) // sign 폴더

// 주어진 토큰을 키로 풀어내는 함수
const verifyToken = (t) => {
    return new Promise((resolve, reject) => {
        jwt.verify(t, cfg.secretKey, (err, v) => {
            if (err) reject(err)
            resolve(v)
        })
    })
}

// 로그인 토큰검사 미들웨어 - 토큰이 있어야 검사할 수 있으니 sign 밑에 등록해야 함
// 로그인시 발행받은 토큰의 유무와 유효성을 판단한다.
// 발행받은 토큰이 없는 경우 여기를 지나가지 못한다.
router.all('*', (req, res, next) => {
    // fe/src/views/header.vue 에서 헤더의 Authorization 에 실어보낸 토큰을
    // 여기서 풀어서 verifyToken() 으로 검사한다.
    const token = req.headers.authorization
    verifyToken(token)
        .then(v => {
            console.log('decoded 토큰 : ')
            console.log(v)
            next()
        })
        .catch(e => {
            console.error('ERROR - token not valid')
            res.send({ success: false, msg: '[ERR01 - SignIn] ' + e.message })
        })
})

// 라우터 모듈 분기
router.use('/test', require('./test')) // test 폴더
router.use('/user', require('./user')) // user 폴더

// 경로에러 처리(라우터에 등록되지 않은 경로인 경우 에러 발생)
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
