# dir-ls
Do the traversal of the source directory structure

## Installation
```bash
$ npm install dir-ls --save
```
## Usage
with options mode:
```js
let ls = require('dir-ls')

ls('./someDir', {
    readMode: 'utf8',
    justFind: /png|jpg|gif/,
    dirCallback(res) {
        //do something here
    },
    fileCallback(res) {
        //do something here
    },
    errorHandle(err) {
        //handle error
    },
    allDone(){
        //dir-ls have been finished
    }
})
```
without options mode:
```js
let ls = require('dir-ls')

ls('./someDir', function(res){
    //equal to fileCallBack
})
```

## Docs
There is only one function in `dir-ls`.


### Function(path[, options])

@param
- path \<string>
- options \<object>|\<Function>

#### string: path
Do the traversal of the source directory structure, the `path` is the target directory that you want to traverse it. 

#### object: options
The `options` could be an object which configures the methods detailedly.
- `options.readMode {string} ` If no readMode is specified, then the raw buffer is returned.
- `options.justFind {RegExp|string}` This options will filter other file formats and return the files that you want. **Notic: if you want to match more than one file format such as `json` and `js`, you need to write the RegExp like `/json$|js$/` to make sure the `dir-ls` use the whole word to match the file**
- `options.dirCallback {function} `This function will be called after an directory have been traversed.
- `options.fileCallback {function} `This function will be called after a file have been traversed.
- `options.allDone {function} `This function will be called after the whole directory have been traversed.
- `options.errorHandle {function} `This function will be called when any error were thrown.

#### object: function
The `options` could be a function which perform as `options.fileCallback`.

## Test
```bash
$ npm test
```

