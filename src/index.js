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
    this.excludeRegex='';
  // }

}
  DropConsoleWebpackPlugin.prototype.findChunks=async function(compilation){
    let chunks = compilation.chunks;
    var self = this;
    for (let i = 0, len = chunks.length; i < len; i++) {
        for(var file of chunks[i].files)
        {
          (async(file,self)=>{
          	// console.log(file,!file.match('chunk')&&!file.match('.map'),this.excludeRegex.length<1||!file.match(this.excludeRegex))
          	if(!file.match('chunk')&&!file.match('.map'))
            {
            	if(this.excludeRegex.length<1||!file.match(this.excludeRegex))
            	{
            		// console.log('toreplace')
		            let source = compilation.assets[file].source()
		            const replaceSource = await self.toReplace(source)
		            compilation.assets[file]=new ConcatSource(replaceSource)
		            // console.log('replaced',replaceSource.match('console.log'))
	        	}
        	}
          })(file,self)
        }
    }
  }

  DropConsoleWebpackPlugin.prototype.toReplace=async function(source){
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
    }if(drop_log )
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

  DropConsoleWebpackPlugin.prototype.initExcludeRegex=function(){
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

  DropConsoleWebpackPlugin.prototype.apply=function(compiler) {
  	const startTime = Date.now()
    var self = this;
    this.excludeRegex = this.initExcludeRegex()
    compiler.plugin('emit',async function(compilation, callback) {
        await self.findChunks(compilation)
        console.info('[drop-console]:'+parseInt((Date.now()-startTime) / 1000)+'s')
        callback();
  });
  }

module.exports = DropConsoleWebpackPlugin;
