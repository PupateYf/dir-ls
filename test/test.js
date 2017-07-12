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
            dirCallback: function(){
                done()
            },
            fileCallback: function(){
                done()
            }
        })
    })
})