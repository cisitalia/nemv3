const router = require('express').Router()
const createError = require('http-errors')

const Board = require('../../../models/boards')
const Article = require('../../../models/articles')

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

// 게시판에 엮인 게시물의 리스트를 가져오는 API
router.get('/list/:_board', (req, res, next) => {
    // 게시판 권한검사를 하려했으나 안되겠넹.. 무엇보다 게시물 보려고 할 때마다
    // 게시판을 검색하는 것도 맘에 안듦
    // if (r.lv < req.user.lv) return res.send({ success: false, msg: `${name} 게시판을 볼 수 있는 자격이 없습니다.` })

    const _board = req.params._board
    // 검색처리
    let { search, sort, order, skip, limit } = req.query
    if (!(sort && order && skip && limit)) throw createError(400, '잘못된 요청입니다')
    if (!search) search = ''
    order = parseInt(order)
    limit = parseInt(limit)
    skip = parseInt(skip)

    const s = {} // 정렬을 위해 선언
    s[sort] = order

    const f = {} // _board 없는 경우 전체 articles 가 된다.
    if (_board) f._board = _board // _board 와 _board._id 를 넘겨서 해당 게시판만 검색한다.

    let total = 0

    Article.countDocuments(f)
        .where('title').regex(search)
        .then(r => {
            total = r
            return Article.find(f) // find({ _board: 'skalskfslf....' })
                .where('title').regex(search)
                .sort(s) // .sort({ title: -1 })
                .skip(skip)
                .limit(limit)
                .select('-content')
                .populate('_user', '-pwd')
        })
        .then(rs => {
            res.send({ success: true, t: total, ds: rs, token: req.token })
        })
        .catch((e) => {
            res.send({ success: false, msg: e.message })
        })
});

// 게시물의 내용을 읽는 API
router.get('/read/:_id', (req, res, next) => {
    const _id = req.params._id

    Article.findByIdAndUpdate(_id, { $inc: {'cnt.view': 1 } }, { new: true })
        .select('content cnt.view') // 내용(content)과 조회수를 가져온다.
        .then(r => {
            if (!r) throw new Error('잘못된 게시판입니다')
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
});

// Article.deleteMany({}).then(r => console.log(r)) // 게시물 전체 지우기

router.post('/:_board', (req, res, next) => {
    const _board = req.params._board
    if (!_board) throw createError(400, '게시판이 선택되지 않았습니다')
    const { title, content } = req.body

    Board.findById(_board) // 먼저 board를 찾는다
        .then(r => {
            if (!r) throw createError(400, '잘못된 게시판입니다')
            if (r.lv < req.user.lv) throw createError(403, '권한이 없습니다')
            const atc = {
                title,
                content,
                _board, // _board: r._id 지만 동일한 board._id 이므로 이렇게 축약해도 된단다.
                ip: '1.1.1.1',//req.ip,
                _user: null // 손님일 경우 그냥 null 로 들어감. 손님도 게시물을 쓸 수 있는 로직
            }
            if (req.user._id) atc._user = req.user._id
            return Article.create(atc) // mongoose.Article.create()
        })
        .then(r => {
            if (!r) throw new Error('게시물이 생성되지 않았습니다')
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.put('/:_id', (req, res, next) => {
    // 손님은 수정 불가
    if (!req.user._id) throw createError(403, '게시물 수정 권한이 없습니다')

    // 파람으로 넘어온 게시물 아이디를 변수로 저장
    const _id = req.params._id

    // Article.findOne({ _id })
    Article.findById(_id) // 이게 더 간편하다
        .then(r => {
            if (!r) throw new Error('게시물이 존재하지 않습니다')
            if (!r._user) throw new Error('손님 게시물은 수정이 안됩니다')
            if (r._user.toString() !== req.user._id) throw new Error('본인이 작성한 게시물이 아닙니다') // 본인만 수정가능

            // 해당 1개의 데이터만 업데이트하고 갱신된 결과를 찾아서 리턴한다. 단 { new: true } 옵션을 줘야 한다.
            return Article.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            res.send({ success: false, msg: e.message })
        })
})

router.delete('/:_id', (req, res, next) => {
    // 손님은 삭제 불가
    if (!req.user._id) throw createError(403, '게시물 삭제 권한이 없습니다')

    // 파람으로 넘어온 게시물 아이디를 변수로 저장
    const _id = req.params._id

    Article.findById(_id)
        .populate('_user', 'lv') // User.lv 만 패칭
        .then(r => {
            if (!r) throw new Error('게시물이 존재하지 않습니다')
            if (!r._user) throw new Error('손님 게시물은 삭제가 안됩니다')
            if (r._user) { // 유저가 없으면 인터널 서버에러가 나므로
                if (r._user.lv < req.user.lv) { // 로그인 유저의 lv가 높으면 레벨이 낮은것임. 낮은 레벨은 삭제불가
                    throw new Error('게시물 삭제 권한이 없습니다')
                }
                else if(r._user.lv == req.user.lv) { // 레벨이 같으면 본인 확인
                    if (r._user._id.toString() !== req.user._id) { // 본인이 맞을 때만.
                        throw new Error('본인이 작성한 게시물이 아닙니다')
                    }
                }
                // else -- 즉 레벨이 높으면 삭제가능
            }
            return Article.deleteOne({ _id })
        })
        .then(r => {
            res.send({ success: true, d: r, token: req.token })
        })
        .catch(e => {
            //console.log(e.message)
            res.send({ success: false, msg: e.message })
        })
})

module.exports = router;
