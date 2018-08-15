'use strict';
const Replace = require('./replace')
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);
const ConcatSource = require("webpack-sources").ConcatSource;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function co(gen) {
    var it = gen();
    var ret = it.next();
    ret.value.then(function(res) {
        it.next(res);
    });
}
function DropConsoleWebpackPlugin(options) {
  // constructor(options) {
    this.options = options;
    this.fileList = [];
    this.pluginName = 'DropConsoleWebpackPlugin'
    this.emitCompilation = null;
  // }

}





  DropConsoleWebpackPlugin.prototype.findChunks=function(compilation){
    let chunks = compilation.chunks;
    var self = this;
    for (let i = 0, len = chunks.length; i < len; i++) {
        for(var file of chunks[i].files)
        {
          (async(file,self)=>{
            let source = compilation.assets[file].source()
            // compilation.assets[file] = this.toReplace(source)
            // compilation.assets[file]
            // console.log( this.toReplace(source))
            // this.toReplace(source)
            // console.log()
            const replaceSource = await self.toReplace(source)
            compilation.assets[file]=new ConcatSource(replaceSource)
          })(file,self)
        }
    }
  }

  DropConsoleWebpackPlugin.prototype.toReplace=async function(source){
    const replace = new Replace(source)
    let drop_log= true,drop_error= false,drop_info= true,drop_warn = true
    if(this.options&&this.options.drop_log === false)
    {
      drop_log = false
    }
    if(this.options&&this.options.drop_error === true)
    {
      drop_error = true
    }if(this.options&&this.options.drop_info === false)
    {
      drop_info = false
    }if(this.options&&this.options.drop_warn === false)
    {
      drop_warn = false
    }
    if(drop_log )
    {
      source = await new Promise((resolve)=>{
        replace.toReplace('console.log',(res)=>{
             resolve(res)
        })
      })
    }
    if(drop_error)
    {
      source = await new Promise((resolve)=>{
        replace.toReplace('console.error',(res)=>{
             resolve(res)
        })
      })
    }if(drop_info )
    {
      source = await new Promise((resolve)=>{
        replace.toReplace('console.info',(res)=>{
             resolve(res)
        })
      })
    }if(drop_warn )
    {
      source = await new Promise((resolve)=>{
        replace.toReplace('console.warn',(res)=>{
             resolve(res)
        })
      })
    }
    return source
  }

  DropConsoleWebpackPlugin.prototype.apply=function(compiler) {
    var self = this;
    compiler.plugin('emit', function(compilation, callback) {
        self.findChunks(compilation)
        callback();
  });
  }

module.exports = DropConsoleWebpackPlugin;
