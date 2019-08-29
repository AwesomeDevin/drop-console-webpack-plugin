function fn(){
  console.log('fn1')
  console.error('fn1')
  console.info('fn1')
  console.warn('fn1')
  return 'fn1'
}

function fn2(){
  console.log('fn2')
  return function fn3(){
    console.log('fn3')
    return 'fn3'
  }
}

function fn4(){
  console.log(4)
  return 'fn4'
}
var a = 1


console.log('root')