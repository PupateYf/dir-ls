'use strict';

let Promise = require('bluebird')
let fs = require('fs')
let co = require('co')
let path = require('path')

fs = Promise.promisifyAll(fs)

const IS_DIR = 'DIR';
const IS_FILE = 'FILE';

/**
 * @description Do the traversal of the source directory structure
 * @param {string} targetPath 
 * @param {object|function} options 
 * @author Yatfung Yueng
 */
function dirTraverse(targetPath, options) {
    if (!options) {
        //nothing to do
    } else if (typeof options == 'function') {
        var fileCallback = options
    } else {
        var { dirCallback, fileCallback, errorHandle, readMode } = options
    }
    let ls = function (targetPath) {
        let curentRes = { path: targetPath };
        co(function* () {
            let tarStatus = yield fs.statAsync(targetPath)
            if (tarStatus.isDirectory()) {
                let files = yield fs.readdirAsync(targetPath)
                files.map(fileName => {
                    let filePath = [targetPath, fileName].join(path.sep)
                    ls(filePath)
                })
                curentRes.type = IS_DIR;
                curentRes.data = files;
            } else {
                //file
                let content = yield fs.readFileAsync(targetPath, '' || readMode)
                curentRes.type = IS_FILE;
                curentRes.data = content;
            }
        }).then(res => {
            switch (curentRes.type) {
                case IS_DIR:
                    dirCallback && dirCallback(curentRes)
                    break;
                case IS_FILE:
                    fileCallback && fileCallback(curentRes)
                    break;
            }
        }).catch(err => {
            errorHandle ? errorHandle(err) : ''
        })
    }
    ls(targetPath)
}

dirTraverse(path.resolve('./test/parentsDir'), {
    readMode: 'utf8',
    dirCallback(res) {
        console.log('The fileList is \n', res)
    },
    fileCallback(res) {
        console.log('The file content is \n', res)
    }
})

module.exports = dirTraverse;



