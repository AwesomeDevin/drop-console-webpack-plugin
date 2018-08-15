class Replace{
    constructor(str,condition){
        this.leftStack = []
        this.rightStack = []
        this.str = new Buffer(str)

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
    async main(condition){
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
                return await new Promise((resolve)=>{
                    process.nextTick(async ()=>{
                       resolve( await this.main(condition))
                   })
                })
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
                return  this.str.toString()  
            }
            return await new Promise((resolve)=>{
                process.nextTick(async ()=>{
                   resolve( await this.main(condition))
               })
            })
    }

    async toReplace(condition)
    {
        return await this.main(condition)
        console.log('result')
    }
    
}

// new Replace('console.log(fun())function A(){console.log(123)}console.log()//123213console.log(dasdadasdfunction(){a})').toReplace('console.log',(res)=>{
//     console.log('result',res)
// })   //test
console.log( new Replace('console.log(fun())function A(){console.log(123)}console.log()//123213console.log(dasdadasdfunction(){a})').toReplace('console.log').then((res)=>{
    console.log(res)
}))
module.exports = Replace