var str = 'console.log(fun())function A(){console.log(123)}console.log()123'
var str2 = 'console.log'


leftStack = []
rightStack = []


function matchLeftBracket(str,condition){
    if(leftStack.length==1)
    {
        return str.indexOf('(',leftStack[leftStack.length-1]+12)
    }
     if(leftStack.length>0)
    {
        return str.indexOf('(',leftStack[leftStack.length-1]+1)
    }
    return str.indexOf(condition)
}
function matchRightBracket(str){
    if(rightStack.length>0)
    {
        return str.indexOf(')',rightStack[rightStack.length-1]+1)
    }
    return str.indexOf(')',leftStack[leftStack.length-1]+1)
}
function toReplace(str,condition){
    let startIndex,endIndex
    startIndex = matchLeftBracket(str,condition)
    endIndex = matchRightBracket(str)
    if(leftStack.length>0&&rightStack.length===leftStack.length)
    {
        var strArr = str.split('')
        strArr.splice(leftStack[0],rightStack[rightStack.length-1]-leftStack[0]+1)
        str = strArr.join('')
        leftStack = []
        rightStack = []
        
        return toReplace(str,condition)
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
        return str
    }
    console.log(str,startIndex,endIndex,leftStack,rightStack)
    return toReplace(str,condition)
}

console.log(toReplace(str,'console.log('))