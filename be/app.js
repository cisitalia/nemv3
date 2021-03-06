var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const history = require('connect-history-api-fallback')
const cors = require('cors')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV !== 'production') app.use(cors()) // 개발모드에서만 적용. 실서버에서는 없애야 함.
app.use('/api', require('./routes/api'))
app.use(history())
app.use(express.static(path.join(__dirname, '..', 'fe', 'dist')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500)
    res.send({ msg: err.message })
    if (process.env.NODE_ENV !== 'production') {
        console.error('>>', err.message)
    }
})

console.log(`${process.env.NODE_ENV} mode started`) // 개발모드인지 실행모드인지 테스트

// connect mongoose
const mongoose = require('mongoose')
// const User = require('./models/users') // 테스트용

// 최상위 경로의 package.json 을 가져와서 뿌려보는 테스트 - 잘된다.
// const pkg = require('../package.json')
// console.log(pkg)

// config 파일을 읽어온다.
const cfg = require('../config')
// console.log(cfg)

// mongoose.connect('mongodb://localhost:27017/nemv', { useNewUrlParser: true }, err => {
mongoose.connect(cfg.dbUrl, { useNewUrlParser: true }, err => {
    if (err) return console.error(err)
    console.log('mongoose connected!')
})

module.exports = app;
