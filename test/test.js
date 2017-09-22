'use strict';

let path = require('path');
let ls = require('../index.js');

test('dir-ls traverse without error', () => {
    const done = jest.fn()
    const testPath = path.resolve('./test/parentsDir')
    ls(testPath, {
        errorHandle: function (err) {
            done(err)
        },
        allDone: function () {
            done()
        }
    })
    expect(done).toHaveBeenCalledTimes(0)
})

test('dir-ls should only traverse txt file', () => {
    const findRegExp = /txt/
    const testPath = path.resolve('./test/parentsDir')
    let fileList = []

    const done = jest.fn()
    
    ls(testPath, {
        justFind: findRegExp,
        errorHandle: function(err){
            done(err)
        },
        fileCallback: function(res){
            fileList.push(res.path)
        },
        allDone: function(){
            let error = new Error();
            fileList = fileList.filter(filePath => filePath.match(findRegExp))
            fileList.length
            ? done()
            : done(error)
        }
    })
    expect(done).toHaveBeenCalledTimes(0)
})

test.only('dir-ls should only traverse someFile3 file', () => {
    const findNameRegExp = '3'
    const testPath = path.resolve('./test/parentsDir')
    let fileList = []

    const done = jest.fn()
    
    ls(testPath, {
        readMode: 'utf8',
        justFindWithName: findNameRegExp,
        errorHandle: function(err){
            done(err)
        },
        fileCallback: function(res){
            fileList.push(res.path)
            console.log(res)
        },
        allDone: function(){
            let error = new Error();
            fileList = fileList.filter(filePath => filePath.match(justFindWithName))
            fileList.length
            ? done()
            : done(error)
        }
    })
    expect(done).toHaveBeenCalledTimes(0)
})
