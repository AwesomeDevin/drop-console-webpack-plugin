
class Replace{
    constructor(str,condition){
        this.leftStack = []
        this.rightStack = []
        this.str = new Buffer(str)
        this.count = 0;
        this.standard = 1000;

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
            // console.log('replaced')
            let leftStack = this.leftStack
            let rightStack = this.rightStack
            let startIndex,endIndex
            startIndex = this.matchLeftBracket(condition)
            endIndex = this.matchRightBracket()
            // console.log('----------',condition,startIndex,leftStack,rightStack,this.str.toString())
            // console.log('++++++++++',leftStack.length>0&&rightStack.length===leftStack.length,startIndex>=0&&leftStack.length<1,startIndex>=0&&startIndex<=endIndex,endIndex>=0 &&leftStack.length>0,startIndex<0&&leftStack.length<1&&rightStack.length<1)
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
                // return process.nextTick(()=>{
                //     return this.toReplace(condition,cb)
                // })
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
            // return process.nextTick(()=>{
            //     return this.toReplace(condition,cb)
            // })
            return this.toRecursive(condition,cb)
    }
    
}

new Replace('console.log(fun())function A(){console.log(123)}console.log()//123213console.log(dasdadasdfunction(){a})').toReplace('console.log',(res)=>{
    console.log('result',res)
})   //test
module.exports = Replace