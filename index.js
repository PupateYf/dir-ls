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
        var { dirCallback, fileCallback, errorHandle, allDone, readMode, justFind } = options
    }
    let fileQuene = ['rootDir'];
    let ls = function (targetPath) {
        let curentRes = { path: targetPath };
        co(function* () {
            let tarStatus = yield fs.statAsync(targetPath)
            if (tarStatus.isDirectory()) {
                let files = yield fs.readdirAsync(targetPath)
                files = files.filter(fileName => {
                    let extNameArr = fileName.split('.')
                    if(extNameArr.length == 1){
                        return true
                    }
                    return extNameArr.pop().match(justFind)
                })
                files.map(fileName => {
                    let filePath = [targetPath, fileName].join(path.sep)
                    ls(filePath)
                })
                fileQuene.pop();
                fileQuene = [...fileQuene, ...files]
                curentRes.type = IS_DIR;
                curentRes.data = files;
            } else {
                let content = yield fs.readFileAsync(targetPath, '' || readMode)
                fileQuene.pop();
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
            if (!fileQuene.length) {
                allDone && allDone();
            }
        }).catch(err => {
            errorHandle ? errorHandle(err) : ''
        })
    }
    ls(targetPath)
}

module.exports = dirTraverse;



