const router = require('express').Router()
const createError = require('http-errors')

// 이제 /manage 는 로그인한 관리자(lv = 0)만 접근가능하게 만든다.
router.all('*', function (req, res, next) {
    if (req.user.lv) throw createError(403, '권한이 없습니다.') // 403 권한오류
    next()
})

// manage api 는 user와 page 등을 관리한다.
// /manage/user
// /manage/page
// 만 허용하겠다는 것임
router.use('/user', require('./user'))
router.use('/page', require('./page'))
router.use('/site', require('./site'))
router.use('/board', require('./board'))

module.exports = router
