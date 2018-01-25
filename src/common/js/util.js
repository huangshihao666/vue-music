function getRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// 把一个数组打乱 
export function shuffle(arr){
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let k = getRandom(0,i)
        let temp = _arr[i]
        _arr[i] = _arr[k]
        _arr[k] = temp
    }
    return _arr
}

// 截流函数  防止多次请求
export function debounce(func,delay){
    let timer
    return function(...arg){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this,arg)
        },delay)
    }
}