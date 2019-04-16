const router = require('express').Router()
const createError = require('http-errors')

const request = require('request')

const Board = require('../../../models/boards')
const Article = require('../../../models/articles')
const Comment = require('../../../models/comments')

const cfg = require('../../../../config')

// 1) 몽구스 검색로직
// Article.find({ title: 'aaaa' }) // 이렇게 해도 되고
// Article.find({}).where('title').regex('aaaa') // 정규표현식으로 보다 정확
// 아직까진 단일 필드 검색만 알고 있지만, 다중 필드 검색도 알아보자.
// 2) 몽구스 정렬로직(sort)
// 하단 const s = {}
// s[sort] = order
// 의 실체는 s['title'] = -1 or 1 이다.
// sort 변수에 정렬할 필드가 넘어오고 order 변수에 -1 혹은 1이 넘어온다.
// 그러므로 정렬할 필드를 다양하게 받아서 조합하면 된다는 것을 알 수 있다.
// 3) countDocuments() 테스트 - 갯수만 가져온다.
// Article.countDocuments({}).then(r => console.log(`count : ${r}`))

// 게시물에 엮인 댓글을 등록 api
router.post('/:_article', (req, res, next) => {
    const _article = req.params._article
    if (!_article) throw createError(400, '게시물이 선택되지 않았습니다')
    const { content, response } = req.body

    if (!content) throw createError(400, '내용이 없습니다')
    if (!response) throw createError(400, '로봇 검증이 없습니다')

    // 구글 리캡챠 검증 로직
    const ro = {
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        json: true,
        form: {
            secret: cfg.recaptchaSecretKey,
            response,
            remoteip: req.ip
        }
    }
    request.post(ro, (err, response, body) => {
        if (err) throw createError(401, '로봇 검증 실패입니다')

        Article.findById(_article)
            .then(r => {
                if (!r) throw createError(400, '잘못된 게시물입니다')
                const cmt = {
                    content,
                    _article,
                    ip: '1.1.1.1',//req.ip,
                    _user: null
                }
                if (req.user._id) cmt._user = req.user._id // 손님이 남긴 댓글은 null로 등록된다.
                return Comment.create(cmt)
            })
            .then(r => {
                if (!r) throw new Error('게시물이 생성되지 않았습니다')
                res.send({ success: true, d: r, token: req.token })
            })
            .catch(e => {
                res.send({ success: false, msg: e.message })
            })
    })
})

// 댓글 아이디로 댓글 수정 api
router.put('/:_id', (req, res, next) => {
    if (!req.user._id) throw createError(403, '댓글 수정 권한이 없습니다')
    const _id = req.params._id

    const { content } = req.body // 댓글이니까 내용만 수정하겠지

    if (!content) throw createError(400, '내용이 없습니다')

    Comment.findById(_id)
        .then(r => {
            if (!r) throw new Error('댓글이 존재하지 않습니다')
            if (!r._user) throw new Error('손님 댓글은 수정이 안됩니다')
            if (r._user.toString() !== req.user._id) throw new Error('본인이 작성한 댓글이 아닙니다')
            return Comment.findByIdAndUpdate(_id, { $set: { content } }, { new: true })
                    .populate('_user') // 댓글을 쓴 유저는 왜 찾을까? 것두 모든 정보를
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

// 댓글 아이디로 댓글 삭제 api
router.delete('/:_id', (req, res, next) => {
    if (!req.user._id) throw createError(403, '댓글 삭제 권한이 없습니다')
    const _id = req.params._id

    Comment.findById(_id).populate('_user', 'lv')
        .then(r => {
            if (!r) throw new Error('댓글이 존재하지 않습니다')
            if (!r._user) {
                if (req.user.lv > 0) throw new Error('손님 댓글은 삭제가 안됩니다')
            }
            else {
                if (r._user._id.toString() !== req.user._id) {
                    if (r._user.lv < req.user.lv) throw new Error('본인이 작성한 댓글이 아닙니다')
                }
            }
            return Comment.deleteOne({ _id })
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;
