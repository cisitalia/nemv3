const router = require('express').Router()
const createError = require('http-errors')

const Site = require('../../../models/sites')

router.get('/', function (req, res, next) {
    Site.findOne({})
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;
