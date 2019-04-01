const router = require('express').Router()
const createError = require('http-errors')

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.send({ msg: 'test', a: 22222 })
    console.log(req.headers)
    res.send({ msg: 'hello', a: 'welcome!' })

})

router.get('/hello', function (req, res, next) {
    res.send({ msg: 'test hello', a: 22222 })
})

module.exports = router;
