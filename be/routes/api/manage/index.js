var express = require('express');
var createError = require('http-errors');
var router = express.Router();

// 이제 /manage 는 로그인한 관리자(lv = 0)만 접근가능하게 만든다.
router.all('*', function (req, res, next) {
    if (req.user.lv) return res.send({ success: false, msg: '권한이 없습니다.' })
    next()
})

// manage api 는 user와 page 등을 관리한다.
// /manage/user
// /manage/page
// 만 허용하겠다는 것임
router.use('/user', require('./user'))
router.use('/page', require('./page'))
router.use('/site', require('./site'))

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api는 없다규'))
});

module.exports = router;
