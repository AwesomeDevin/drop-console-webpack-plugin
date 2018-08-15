
class Replace{
    constructor(str,condition){
        this.leftStack = []
        this.rightStack = []
        this.str = new Buffer(str)
        this.count = 0;
        this.standard = 10;

    }
    matchLeftBracket(condition){
        let leftStack = this.leftStack
        let rightStack = this.rightStack

        if(leftStack.length==1)
        {
            return this.str.toString().indexOf('(',leftStack[leftStack.length-1]+condition.length+2)
        }
         if(leftStack.length>0)
        {
            return this.str.toString().indexOf('(',leftStack[leftStack.length-1]+1)
        }
        return this.str.toString().indexOf(condition+'(')
    }
    matchRightBracket(){
        let leftStack = this.leftStack
        let rightStack = this.rightStack
        
        if(rightStack.length>0)
        {
            return this.str.toString().indexOf(')',rightStack[rightStack.length-1]+1)
        }
        return this.str.toString().indexOf(')',leftStack[leftStack.length-1]+1)
    }
    toRecursive(condition,cb){
        this.count++;
        if(this.count>=this.standard)
        {
            this.count = 0;
            return process.nextTick(()=>{
                return this.toReplace(condition,cb)
            })
        }
        else
        {
            return this.toReplace(condition,cb)
        }
    }
    toReplace(condition,cb){
            let leftStack = this.leftStack
            let rightStack = this.rightStack
            let startIndex,endIndex
            startIndex = this.matchLeftBracket(condition)
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
                return this.toRecursive(condition,cb)
            }
            if(startIndex>=0&&leftStack.length<1)
            {
                leftStack.push(startIndex)
            }
            else if(startIndex>=0&&startIndex<=endIndex)
            {
                leftStack.push(startIndex)
            }
            else if(endIndex>=0 &&leftStack.length>0)
            {
                rightStack.push(endIndex)
            }
            else if(startIndex<0&&leftStack.length<1&&rightStack.length<1){
                 cb(this.str.toString())
                 return
            }
            return this.toRecursive(condition,cb)
    }
    
}

module.exports = Replace