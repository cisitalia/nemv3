var express = require('express')
var createError = require('http-errors')
var router = express.Router()

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
// 토큰이 없는 상태로 접근해야 하므로 토큰검사 위에 위치해야 한다.
router.use('/sign', require('./sign')) // sign 폴더

// 회원가입
router.use('/register', require('./register')) // register 폴더

// 사이트 관리는 타이틀,카피라이트,다크모드 등 사이트의 디자인 관련이다.
// 때문에 권한과 상관없으니 여기 위치
router.use('/site', require('./site')) // site 폴더

// 주어진 토큰을 키로 풀어내는 함수
const verifyToken = (t) => {
    return new Promise((resolve, reject) => {
        if (!t) resolve({ id: 'guest', name: '손님', lv: 3 })
        if ((typeof t) !== 'string') reject(new Error('문자가 아닌 토큰입니다'))
        if (t.length < 10) resolve({ id: 'guest', name: '손님', lv: 3 })
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
            // console.log('decoded 토큰 : ')
            // console.log(v)

            // * req.user 변수에 유저정보를 넣는다. id/age/lv 정보가 들어있다
            // 토큰을 풀어놓은 req.user는 중요한 데이터다!
            req.user = v
            next()
        })
        .catch(e => {
            console.error('ERROR - token not valid')
            res.send({ success: false, msg: '[ERR01 - SignIn] ' + e.message })
        })
})

// 테스트 : http://localhost:3000/api/ 으로 들어가면 유저정보를 볼 수 있다.
// router.all('*', (req, res, next) => {
//     res.send({ reqUser: req.user })
// })

// * 토큰을 풀어서 만들어진 유저정보 req.user 는 이 밑의 라우터에서 잡을 수 있다.
// 라우터 순서가 이렇게 중요하다.

// 페이지 생성(관리자) 및 페이지 진입(레벨에 따라)을 막는 api
router.use('/page', require('./page'))

// 관리용 api : 유저와 페이지 관리 (관리자만 가능)
router.use('/manage', require('./manage'))

router.all('*', function (req, res, next) {

    // 로그인한 유저의 토큰을 풀어놓은 정보는 req.user에 담겨있다
    // console.log(req.user)

    // 또 검사해도 됨
    if (req.user.lv > 2) return res.send({ success: false, msg: '권한이 없습니다.' })
    next()
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
