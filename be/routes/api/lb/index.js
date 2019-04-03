const router = require('express').Router()

// 로드밸런스 상태 체크용 파일입니다

router.get('/', (req, res, next) => {
    res.send({ success: true })
})

module.exports = router
