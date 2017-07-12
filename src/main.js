let Promise = require('bluebird')
let fs = require('fs')
let co = require('co')
let path = require('path')


fs = Promise.promisifyAll(fs)

/**
 * @description Do the traversal of the source directory structure
 * @param {string} targetPath 
 * @param {object|function} options 
 * @author Yatfung Yueng
 */
function ls(targetPath, options) {
    if (!options) {
        //nothing to do
    } else if (typeof options == 'function') {
        var fileCallback = options
    } else {
        var { dirCallback, fileCallback, readMode } = options
    }
    co(function* () {
        let tarStatus = yield fs.statAsync(targetPath)
        if (tarStatus.isDirectory()) {
            let files = yield fs.readdirAsync(targetPath)
            dirCallback ? dirCallback(targetPath, files) : ''
            files.map(fileName => {
                let filePath = [targetPath, fileName].join(path.sep)
                ls(filePath, options)
            })
        } else {
            //file
            let content = yield fs.readFileAsync(targetPath, '' || readMode)
            fileCallback ? fileCallback(targetPath, content) : ''
        }
    }).catch(err => {
        console.log(err)
    })
}

// ls(path.resolve('./src/test/A'), { 
//     readMode: 'utf8',
//     dirCallback(dirPath, fileList){
//         console.log('The fileList is', fileList)
//     },
//     fileCallback(filePath, fileContent){
//         console.log('The file content is ', fileContent)
//     }
// })

module.exports = ls;



