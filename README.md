# nemv3
node express mongo vue

## /config/index.js 환경파일 세팅 방법

```javascript

module.exports = {
    dbUrl: 'mongodb://localhost:27017/nemv' // 로컬
}

// app.js 에서 index.js 파일 불러들임. index 파일은 파일명을 넘기지 않아도 된다.
const cfg = require('../config')
mongoose.connect(cfg.dbUrl, { useNewUrlParser: true }, err => {
    ...
}

```

이런식으로 몽고디비 연결 문자열을 작성해야 웹서버가 정상구동됨

---

### 새 탭으로 마크다운 미리 보기
> Shift + Cmd + v


### 분할탭으로 마크다운 실시간 보기
> Cmd + k 누른다음 v

> test
>> test

1. test
2. test
3. test

* red
  * green
    * blue

마크다운은 코드블럭을 `<pre>`와 `<code>`로 감쌉니다.


