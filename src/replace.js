class Replace{
    constructor(str,condition){
        this.leftStack = []
        this.rightStack = []
        this.str = str

    }
    matchLeftBracket(condition){
        let leftStack = this.leftStack
        let rightStack = this.rightStack

        if(leftStack.length==1)
        {
            return this.str.indexOf('(',leftStack[leftStack.length-1]+condition.length+2)
        }
         if(leftStack.length>0)
        {
            return this.str.indexOf('(',leftStack[leftStack.length-1]+1)
        }
        return this.str.indexOf(condition+'(')
    }
    matchRightBracket(){
        let leftStack = this.leftStack
        let rightStack = this.rightStack
        
        if(rightStack.length>0)
        {
            return this.str.indexOf(')',rightStack[rightStack.length-1]+1)
        }
        return this.str.indexOf(')',leftStack[leftStack.length-1]+1)
    }
    toReplace(condition){
        let leftStack = this.leftStack
        let rightStack = this.rightStack
        let startIndex,endIndex

        startIndex = this.matchLeftBracket(condition)
        endIndex = this.matchRightBracket()
        if(this.str.length<1)
        {
            return this.str
        }
        if(leftStack.length>0&&rightStack.length===leftStack.length)
        {
            var strArr = this.str.split('')
            strArr.splice(leftStack[0],rightStack[rightStack.length-1]-leftStack[0]+1)
            this.str = strArr.join('')
            this.leftStack = []
            this.rightStack = []
            return this.toReplace(condition)
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
            return this.str
        }
        return this.toReplace(condition)
    }
    
}

// console.log(new Replace('console.log(fun())function A(){console.log(123)}console.log()').toReplace('console.log'))   //test
module.exports = Replace