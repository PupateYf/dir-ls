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
        var { dirCallback, fileCallback, errorHandle, allDone, readMode, justFindWithName, justFind } = options
    }

    let fileQuene = ['rootDir'];

    let shouldMatchExt = justFind

    let shouldMatchFileName = justFindWithName

    let ls = function (targetPath) {

        let curentRes = { path: targetPath }

        co(function* () {

            let tarStatus = yield fs.statAsync(targetPath)

            if (tarStatus.isDirectory()) {
                let files = yield fs.readdirAsync(targetPath)

                files.map(fileName => {
                    let filePath = [targetPath, fileName].join(path.sep)
                    ls(filePath)
                })

                fileQuene.pop();
                fileQuene = [...fileQuene, ...files]
                curentRes.type = IS_DIR
                curentRes.data = files

            } else {

                let fileNameArr = [targetPath.split(path.sep).pop()]

                fileNameArr = fileNameArr
                    .filter(fileName => {
                        let temp = fileName.split('.')
                        if (shouldMatchExt) {
                            if (temp.length > 1) {
                                return temp[1].match(justFind)
                            } else {
                                return false
                            }
                        }
                        return true
                    })
                    .filter(fileName => {
                        let temp = fileName.split('.')
                        if (shouldMatchFileName) {
                            return temp[0].match(justFindWithName)
                        }
                        return true
                    })

                if (fileNameArr.length != 0) {
                    let content = yield fs.readFileAsync(targetPath, '' || readMode)
                    curentRes.type = IS_FILE
                    curentRes.data = content
                }

                fileQuene.pop();
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



