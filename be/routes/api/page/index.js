var express = require('express')
var createError = require('http-errors')
var router = express.Router()

const Page = require('../../../models/pages')

// post 로 들어오는 즉, 새로운 페이지를 생성하는 로직이다
router.post('/', function (req, res, next) {
    const { name } = req.body
    Page.findOne({ name })
        .then((r) => {
            if (!r) {
                // 관리자가 아닌 경우 페이지 생성불가
                if (req.user.lv) throw new Error(`페이지 ${name} 생성이 안되었습니다.`) // req.user.lv > 0
                // 관리자인 경우 페이지 생성
                return Page.create({ name })
            }

            // 페이지의 레벨과 유저레벨이 맞지 않으면 이용할 수 없다.
            if (r.lv < req.user.lv) throw new Error(`페이지 ${name} 이용 자격이 없습니다.`)

            // 접근 카운트를 1 더한다
            return Page.updateOne({ _id: r._id }, { $inc: { inCnt: 1 } })
        })
        .then(() => {
            //   return Page.find()
            // })
            // .then((rs) => {
            //   console.log(rs)

            // 토큰을 해제한 유저 정보는 req.user 에 담겨있고 이것을 d 객체에 담아 페이지에 보낸다
            res.send({ success: true, d: req.user })
        })
        .catch((e) => {
            res.send({ success: false, msg: e.message })
        })
});

router.all('*', function (req, res, next) {
    next(createError(404, '그런 api 없어'));
});

module.exports = router;