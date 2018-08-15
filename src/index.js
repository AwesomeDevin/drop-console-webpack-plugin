'use strict';
const Replace = require('./replace')
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


class DropConsoleWebpackPlugin {
  constructor(options) {
    this.options = options;
    this.fileList = [];
    this.pluginName = 'DropConsoleWebpackPlugin'
    this.emitCompilation = null;
  }

  async findChunks(compilation){
    var self = this;
    let chunks = compilation.chunks;
    for (let i = 0, len = chunks.length; i < len; i++) {
        for(var file of chunks[i].files)
        {
          (async(file,self,compilation)=>{
            let source = compilation.assets[file].source()
            console.log(file)
            var replacedSource = await self.toReplace(source)
            compilation.assets[file].source = ()=>{
              return  replacedSource
            }
          })(file,self,compilation)
          // compilation.assets[file].source = await this.toReplace(source)
        }
    }
  }

   async toReplace(source){
    const replace = new Replace(source)
    console.log('toReplace')
    let drop_log= true,drop_error= false,drop_info= true,drop_warn = false
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
    }if(this.options&&this.options.drop_warn === true)
    {
      drop_warn = true
    }
    if(drop_log )
    {
      source = await new Promise((resolve)=>{
        replace.toReplace('console.log',(res)=>{
             resolve(res)
             console.log('replaced')
        })
      })
    }
    if(drop_error)
    {
      source = await  new Promise((resolve)=>{
        replace.toReplace('console.error',(res)=>{
             resolve(res)
        })
      })
    }if(drop_info )
    {
      source = await  new Promise((resolve)=>{
        replace.toReplace('console.info',(res)=>{
             resolve(res)
        })
      })
    }if(drop_warn )
    {
      source =  await new Promise((resolve)=>{
        replace.toReplace('console.warn',(res)=>{
             resolve(res)
        })
      })
    }
    
    return source
  }

  apply(compiler) {
    compiler.hooks.emit.tap(this.pluginName,async (compilation) => {
        await this.findChunks(compilation)
    });
  }
}

module.exports = DropConsoleWebpackPlugin;