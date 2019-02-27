# nemv3
node express mongo vue

## config/ 디렉토리 세팅 방법

```javascript

module.exports = {
    dbUrl: 'mongodb+srv://nemv:dbforcloud!@cluster0-rknrp.mongodb.net/nemv' // 원격
    // dbUrl: 'mongodb://localhost:27017/nemv' // 로컬
}

```

이런식으로 몽고디비 연결 문자열을 작성해야 웹서버가 정상구동됨
