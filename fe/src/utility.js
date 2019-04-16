const moment = require('moment')

exports.moduleTest = function () {
    console.log('>>> mouldddd')
}

exports.id2date = function (val) {
    if (!val) return '잘못된 시간정보'
    // return new Date(parseInt(val.substring(0, 8), 16) * 1000).toLocaleString()
    return moment(parseInt(val.substring(0, 8), 16) * 1000).format('YY.MM.DD')
}

exports.id2datetime = function (val) {
    if (!val) return '잘못된 시간정보'
    // return new Date(parseInt(val.substring(0, 8), 16) * 1000).toLocaleString()
    return moment(parseInt(val.substring(0, 8), 16) * 1000).format('YY.MM.DD HH:mm:ss')
}
