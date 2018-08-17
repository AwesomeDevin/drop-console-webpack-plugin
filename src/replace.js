
class Replace{
    constructor(str,condition){
        this.leftStack = []
        this.rightStack = []
        this.str = new Buffer(str)
        this.count = 0;
        this.standard = 10;
        this.regexStr = '';
        this.orIndex = 0;
    }
    matchLeftBracket(conditionArr){
        let leftStack = this.leftStack
        let rightStack = this.rightStack
        let condition
        let conditionMatch = this.str.toString().match(this.regexStr)
        
        if(this.regexStr.length<1)
        {
            return -1
        }
        else if(conditionMatch&&conditionMatch.length>0)
        {
            condition = conditionMatch[this.orIndex]
        }
        else
        {
        	return -1
        }
        
    	if(leftStack.length==1)
        {
           
            return this.str.toString().indexOf('(',leftStack[leftStack.length-1]+condition.length+2)
        }
         if(leftStack.length>0)
        {
            return this.str.toString().indexOf('(',leftStack[leftStack.length-1]+1)
        }
        const index =  this.str.toString().indexOf(condition+'(',this.orIndex)
        if(this.str.toString().charAt(index-2) == '|' || this.str.toString().charAt(index-2) == '&')
        {
           this.orIndex += 1
           return this.matchLeftBracket(conditionArr)
        }
        
        this.orIndex = 0;
        return index
    }
    getRegex(conditionArr){
        var str = ''
        if(conditionArr.length<1)
        {
            return str
        }
    	for(var index in conditionArr)
    	{
    		if(index == 0){
    			str += conditionArr[index]
    		}
    		else
    		{
    			str = str + '|' + conditionArr[index]
    		}
    	}
    	return new RegExp(str,'g')
    }
    matchRightBracket(){
        let leftStack = this.leftStack
        let rightStack = this.rightStack
        
        if(rightStack.length>0)
        {
            return this.str.toString().indexOf(')',rightStack[rightStack.length-1]+1)
        }
        const index = leftStack[leftStack.length-1]?leftStack[leftStack.length-1]:0
        return this.str.toString().indexOf(')',index+1)
    }
    toRecursive(conditionArr,cb){
        this.count++;
        if(this.count>=this.standard)
        {
            this.count = 0;
            return process.nextTick(()=>{
                return this.toReplace(conditionArr,cb)
            })
        }
        else
        {
            return this.toReplace(conditionArr,cb)
        }
    }
    toReplace(conditionArr,cb){
            let leftStack = this.leftStack
            let rightStack = this.rightStack
            let startIndex,endIndex
            startIndex = this.matchLeftBracket(conditionArr)
            endIndex = this.matchRightBracket()
            if(this.str.toString().length<1)
            {
                return this.str.toString()
            }
            if(leftStack.length>0&&rightStack.length===leftStack.length)
            {
                var strArr = this.str.toString().split('')
                strArr.splice(leftStack[0],rightStack[rightStack.length-1]-leftStack[0]+1)
                this.str = new Buffer(strArr.join(''))
                this.leftStack = []
                this.rightStack = []
                return this.toRecursive(conditionArr,cb)
            }
            if(startIndex>=0&&leftStack.length<1)
            {
                leftStack.push(startIndex)
            }
            else if(endIndex>=0 &&leftStack.length>0)
            {
                rightStack.push(endIndex)
            }
            else if(startIndex>=0&&startIndex<=endIndex)
            {
                leftStack.push(startIndex)
            }
            else if(startIndex<0&&leftStack.length<1&&rightStack.length<1){
                 cb(this.str.toString())
                 return
            }
            return this.toRecursive(conditionArr,cb)
    }
    startReplace(conditionArr,cb){
        // console.log('---')
    	this.regexStr = this.getRegex(conditionArr)
    	return this.toReplace(conditionArr,cb)
    }
    
}

// new Replace('dsad||console.log(fun())function A(){console.info(123)}console.error()//123213console.warn(dasdadasdfunction(){a})').startReplace(['console.info','console.log','console.error','console.warn'],(res)=>{
//     console.log('result',res)
// })   //test
module.exports = Replace