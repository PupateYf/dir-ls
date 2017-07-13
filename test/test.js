'use strict';

let path = require('path');
let ls = require('../index.js');

describe('#dir-traversal', function () {
    it('should traverse without error', function (done) {
        var testPath = path.resolve('./test/parentsDir')
        ls(testPath, {
            errorHandle: function(err){
                done(err)
            },
            allDone: function(){
                done()
            }
        })
    })
    it('should only traverse txt file', function(done){
        var findRegExp = /txt/
        var testPath = path.resolve('./test/parentsDir')
        var fileList = []
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
    })
})
