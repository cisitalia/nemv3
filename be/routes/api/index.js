const router = require('express').Router()
const createError = require('http-errors')

const jwt = require('jsonwebtoken')
const cfg = require('../../../config')
const moment = require('moment')

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

// 로드밸런스 상태 체크용 api - 간단히 성공만 리턴한다
router.use('/lb', require('./lb'))

// 로그인시 아이디/비번 검사 & 토큰발행하는 sign 모듈사용
// /sign/in 으로 들어오는 로그인을 처리한다.
// 토큰이 없는 상태로 접근해야 하므로 토큰검사 위에 위치해야 한다.
router.use('/sign', require('./sign')) // sign 폴더

// 회원가입
// router.use('/register', require('./register')) // register 폴더

// 사이트 관리는 타이틀,카피라이트,다크모드 등 사이트의 디자인 관련이다.
// 때문에 권한과 상관없으니 여기 위치
router.use('/site', require('./site')) // site 폴더

// 게시판으로 보내는 미들웨어 - 토큰검사 위로 이동
// 버그존재(해결) - 레벨적용이 풀림. 최초 페이지 접근시에는 적용되나, 이후 게시판으로 이동시 풀림
router.use('/board', require('./board'))

// 구글 리캡챠 적용 .. 테스트키로 테스트용도로 사용했던것 같다.
router.use('/recaptcha', require('./recaptcha'))

// 주어진 토큰을 키로 풀어내는 함수
const verifyToken = (t) => {
    return new Promise((resolve, reject) => {
        if (!t) resolve({ id: 'guest', name: '손님', lv: 3 })
        if ((typeof t) !== 'string') reject(new Error('문자가 아닌 토큰입니다'))
        if (t.length < 10) resolve({ id: 'guest', name: '손님', lv: 3 })
        jwt.verify(t, cfg.jwt.secretKey, (err, v) => {
            if (err) reject(err)
            resolve(v)
        })
    })
}

// 토큰 재발급 함수
// be/routes/api/sign/index.js 에 있는 signToken() 는 로그인시 토큰을 발급하는 함수인데 반해,
// 아래 토큰 재발급 함수는 만료시간을 체크(토큰 기한 = 만료시간 - 발급시간)해서 재발급해 준다.
// 가장 큰 이유는 remember 를 통해 저장된 기한을 알 수 없기 때문이다.
const signToken = (_id, id, lv, name, exp) => {
    return new Promise((resolve, reject) => {
        const o = {
            issuer: cfg.jwt.issuer,
            subject: cfg.jwt.subject,
            expiresIn: cfg.jwt.expiresIn, // 3분
            algorithm: cfg.jwt.algorithm,
            expiresIn: exp
        }
        // > 이게 필요없다. if (rmb) o.expiresIn = cfg.jwt.expiresInRemember // 6일 보관
        jwt.sign({ _id, id, lv, name }, cfg.jwt.secretKey, o, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

// 토큰 재발급 함수 - 토큰만료시간 체크, verifyToken(t) 도 같이 행한다.
const getToken = async (t) => {
    let vt = await verifyToken(t) // 토큰을 풀자
    if(vt.lv > 2) return { user: vt, token: null } // 손님계정은 그냥 나감

    // 남은시간(초) = 토큰 만료시간(초)과 현재시간(초)의 차
    const diff = moment(vt.exp * 1000).diff(moment(), 'seconds')
    if (process.env.NODE_ENV === 'development') console.log(diff) // 개발모드면 남은시간(초)를 보여줌

    // 남은시간이 재발급 유효시간보다 크면 재발행 하지 않고 넘어감.
    // cfg.jwt.expiresInDiv 이 숫자가 클 수록 재발급 시간이 촉박해짐 - 남은시간이 얼마 없을때 재발급된다는 의미
    // cfg.jwt.expiresInDiv이 6이면 5분 남았을 때 재발급, 30이면 1분 남았을 때 재발급된다.
    const expSec = (vt.exp - vt.iat) // 토큰기한(초) = 만료시간 - 발급시간
    if (diff > expSec / cfg.jwt.expiresInDiv) return { user: vt, token: null }

    // 60초보다 작으면 토큰 재발행(토큰기한으로 발행)
    const nt = await signToken(vt._id, vt.id, vt.lv, vt.name, expSec)
    vt = await verifyToken(nt)
    return { user: vt, token: nt }
}

// [로그인 토큰검사 미들웨어] - 토큰이 있어야 검사할 수 있으니 sign 밑에 등록해야 함
// 로그인시 발행받은 토큰의 유무와 유효성을 판단한다.
// 발행받은 토큰이 없는 경우 여기를 지나가지 못한다.
// fe/src/router.js 에서 axios 헤더의 Authorization 에 실어보낸 토큰을 풀어서 검사한다.
router.all('*', (req, res, next) => {
    // 토큰 만료시간 체크와 재발행을 겸하는 함수로 대체
    getToken(req.headers.authorization)
        .then(v => {
            if (process.env.NODE_ENV === 'development') {
                console.log(':: be/routes/api/index.js 에서 찍어봄 ::')
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
                console.log(v) // 전체 토큰 객체를 찍어본다
            }
            req.user = v.user
            req.token = v.token
            next()
        })
        .catch(e => next(createError(401, e.message))) // 401 에러는 인증에러
})

// 테스트 : http://localhost:3000/api/ 으로 들어가면 유저정보를 볼 수 있다.
// router.all('*', (req, res, next) => {
//     res.send({ reqUser: req.user })
// })

// * 토큰을 풀어서 만들어진 유저정보 req.user 는 이 밑의 라우터에서 잡을 수 있다.
// 라우터 순서가 이렇게 중요하다.

// [방화벽 미들웨어] 페이지 생성(관리자) 및 페이지 진입(레벨에 따라)을 막는 api
router.use('/page', require('./page'))

// 게시물로 보내는 미들웨어 - 여기 앞에서는 유저 권한 검사를 하는구나
router.use('/article', require('./article'))
// 댓글 api 로 보내는 미들웨어
router.use('/comment', require('./comment'))

// 관리용 api : 관리자만 접근가능 가능
// 위에서 생성한 req.user 를 이용해 req.user.lv 로 관리자 인증시도
router.use('/manage', require('./manage'))

// router.all('*', function (req, res, next) {
//     // 로그인한 유저의 토큰을 풀어놓은 정보는 req.user에 담겨있다
//     // console.log(req.user)
//     // 또 검사해도 됨
//     if (req.user.lv > 2) return res.send({ success: false, msg: '권한이 없습니다.' })
//     next()
// })

// 라우터 모듈 분기 - 아래 api는 보호받고 있다
router.use('/user', require('./user')) // user 폴더
// router.use('/test', require('./test')) // test 폴더


// 새로 추가 :: 없는 경로인 경우 404 라우터로 뺀다!
router.all('*', require('./notFound'))

module.exports = router
