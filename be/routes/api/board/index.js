const router = require('express').Router()
const createError = require('http-errors')

const Board = require('../../../models/boards')

router.all('*', function (req, res, next) {
    // if (req.user.lv) return res.send({ success: false, msg: '권한이 없습니다.' })
    next()
})

// 게시판 목록 중 특정 게시판의 이름으로 해당 게시판이 있는지 확인한다.
router.get('/read/:name', function (req, res, next) {
    const name = req.params.name
    Board.findOne({ name })
        .then((r) => {
            // 권한으로 못보게 하려면.. 이거 안되는데?
            // routes/api/index.js 에서 board 를 토큰검사 위로 올렸기 때문에 처리가 안됨
            // // article/index.js 에서 검사하는 것도 어려움
            // console.log('>>>>')
            // console.log(req.user) // 안찍힌다 .. req.user가 만들어지기 이전이므로
            // if (r.lv < req.user.lv) return res.send({ success: false, msg: `${name} 게시판을 볼 수 있는 자격이 없습니다.`})
            res.send({ success: true, d: r, token: req.token })
        })
        .catch((e) => {
            res.send({ success: false, msg: e.message })
        })
})

// 게시판 리스트를 얻어온다.
router.get('/list', (req, res, next) => {
    Board.find().sort({ lv: -1 }) // 게시판 접근 레벨로 내림차순 정렬
        .then(rs => {
            res.send({ success: true, ds: rs, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;
