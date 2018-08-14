'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


class HelloWorldPlugin {
  constructor(options) {
    this.options = options;
    this.fileList = [];
    this.pluginName = 'HelloWorldPlugin'
    this.emitCompilation = null;
  }


  saveToFile(compiler,compilation){
    console.log('saveToFile')
    for(var item of this.fileList)
      {
        const filePath = _path2.default.join(compiler.outputPath,item.fileName)
        item.filePath = filePath;
        console.log('--------------',filePath);
        var self = this;
        (function(item){
          _fs2.default.readFile(filePath, function (err, data) {
            if (err) {
                return console.error(err);
            }
            const assets = data.toString()
            console.log(assets)
            item.assets = assets
         });
        })(item)
      }
  }

  apply(compiler) {
    compiler.hooks.emit.tap(this.pluginName, (compilation) => {
      compilation.assets['file.txt'] = {
        source() {
          return '123456';
        },
        size() {
          return '123456'.length;
        }
      };
    });
    compiler.hooks.afterEmit.tapAsync(this.pluginName, (compilation,callback) => {
      for (var filename in compilation.assets) {
        console.log('>>>>>>>>>>>>>>',filename)
        this.fileList.push({'fileName':filename})
      }
        // compilation.assets['file.txt'] = {
        //   source() {
        //     return '123456';
        //     callback()
        //   },
        //   size() {
        //     return '123456'.length;
        //   }
        // };
      callback(this.saveToFile(compiler,compilation))
    });
    compiler.hooks.done.tap(this.pluginName, () => {
      console.log('Hello World end!');
      console.log(this.options);
      // console.log(this.fileList) 
    });

    
  }
}

module.exports = HelloWorldPlugin;