const mongoose = require('mongoose')
const cfg = require('../../config')

mongoose.set('useCreateIndex', true)

const siteSchema = new mongoose.Schema({
    title: { type: String, default: 'default', index: true },
    copyright: { type: String, default: '© 2019 default' },
    dark: { type: Boolean, default: false }
})

const Site = mongoose.model('Site', siteSchema)

// 설정값이 하나도 없는 경우 기본 site 로 생성
Site.findOne()
    .then(r => {
        if (!r) return Site.create({})
        return Promise.resolve(null)
    })
    .then(r => {
        if (r) console.log(`${r.title} site is created`)
    })
    .catch(e => console.error(e.message))

// 모든 Site 를 삭제하는 루팅 - 삭제하고 초기화 할때 사용하라. 그리고 주석처리
// Site.deleteMany({})
//     .then(r => console.log(r))
//     .catch(e => console.error(e.message))

module.exports = Site
