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
    this.excludeRegex='';
  }

  async findChunks(compilation){
    var self = this;
    let chunks = compilation.chunks;
    for (let i = 0, len = chunks.length; i < len; i++) {
        for(var file of chunks[i].files)
        {
          (async(file,self,compilation)=>{
            if(!file.match('chunk')&&!file.match('.map'))
            {
                if(this.excludeRegex.length<1||!file.match(this.excludeRegex))
                {
                  let source = compilation.assets[file].source()
                  var replacedSource = await self.toReplace(source)
                  compilation.assets[file].source = ()=>{
                    return  replacedSource
                  }
              }
            }
          })(file,self,compilation)
        }
    }
  }

   async toReplace(source){
    const replace = new Replace(source)
    const conditionArr = []
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
    	conditionArr.push('console.log')
    }
    if(drop_error)
    {
    	conditionArr.push('console.error')

    }if(drop_info )
    {
    	conditionArr.push('console.info')
    }if(drop_warn )
    {
    	conditionArr.push('console.warn')
    }
    source = await new Promise((resolve)=>{
    	replace.startReplace(conditionArr,(res)=>{
    		resolve(res)
    	})
    })
    
    return source
  }

   initExcludeRegex(){
    const excludeArr = this.options.exclude
    if(!this.options||!excludeArr||excludeArr.length<1)
    {
      return ''
    }
    var str = ''
    	for(var index in excludeArr)
    	{
    		if(index == 0){
    			str += excludeArr[index]
    		}
    		else
    		{
    			str = str + '|' + excludeArr[index]
    		}
    	}
    	return new RegExp(str)
  }

  apply(compiler) {
    // remove in origin file
    // compiler.hooks.afterCompile.tapAsync(this.pluginName,async (compilation,callback)=>{    
    //   this.excludeRegex = this.initExcludeRegex()
    //   compilation.fileDependencies.forEach(async(item)=>{
    //     if(!item.match(this.excludeRegex))    //to filter 
    //     {
    //       let origin =await new Promise((resolve)=>{
    //         _fs.readFile(item,(err,data)=>{
    //           if(err)
    //           {
    //             return 
    //           }
    //           else
    //           {
    //             resolve(data.toString())
    //           }
    //         })
    //       }) 
    //       origin = await this.toReplace(origin)
    //       await new Promise((resolve)=>{
    //         _fs.writeFile(item,origin,(err)=>{
    //           resolve()
    //         })
    //       })
    //     }
    //   })
    //   // console.info('drop-console:'+parseInt((Date.now()-startTime) )+'ms')
    //   callback()
    // })
    compiler.hooks.emit.tap(this.pluginName,async (compilation) => {
        const startTime = Date.now()
        this.excludeRegex = this.initExcludeRegex()
        await this.findChunks(compilation)   //remove in compilation,the performace is not good,so that abandon
        console.info('[drop-console]: '+parseInt((Date.now()-startTime) /1000 )+'s')
    });
  }
}

module.exports = DropConsoleWebpackPlugin;