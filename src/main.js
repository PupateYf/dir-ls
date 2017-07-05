let Promise = require('bluebird')
let fs = require('fs')
let co = require('co')
let path = require('path')


fs = Promise.promisifyAll(fs)
// fs.readdir = Promise.promisify(fs.readdir)

var ls = function (targetPath) {
    co(function* () {
        // let exists = yield fs.accessAsync(targetPath)
        // console.log('> exists is', exists)
        // let tarStatus = yield fs.statAsync(targetPath)
        // console.log('> ',tarStatus)
    })
}

ls(path.resolve('./test/A'))

// console.log(fs.readdirAsync.toString());
// console.log(path.resolve('./test/A'))
// fs.readdir(__dirname).then(data => {
//     let filePath = __dirname + path.sep + data;
//     console.log(data)
// })