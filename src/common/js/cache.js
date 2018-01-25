import storage from 'good-storage'   // 第三方封装localstorage

const SEARCH_KEY = '__search__'   // 存入storage的key
const SEARCH_MAX_LENGTH = 15      //  搜索历史列表数据最多15条

export function saveSearch(query){
    let searchs = storage.get(SEARCH_KEY,[])
    insertArray(searchs,query,(item) => {
        return item === query
    },SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY,searchs)
    return searchs
}

// 初始化state中的searchHistory 
export function loadSearch(){
    return storage.get(SEARCH_KEY,[])
}

// 删除其中一条数据
export function deleteSearchOne(query){
    let searches = storage.get(SEARCH_KEY,[])
    removeFromArray(searches,(item) => {
        return item === query
    })
    storage.set(SEARCH_KEY,searches)
    return searches
}

// 清空搜索历史
export function clearSearch(){
    storage.remove(SEARCH_KEY)
    return []
} 

// 插入数组函数  如果有先删除再插入  如果没有直接插入第一个  如果长度大于15需要删除 
function insertArray(arr,val,compare,maxLen){
    const index = arr.findIndex(compare)  // 定义当前存入搜索项在之前缓存中的索引

    if(index === 0){   // 如果刚好在第一个位置 直接return
        return
    }
    if(index > 0){    // 如果存在且不再地第一个位置  需要先删除再添加在数组的最前边
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(maxLen && arr.length > maxLen){   // 如果长度大于定义的长度  删除最后一个 保持最近搜索的在第一个
        arr.pop()
    }
}

// 删除数组中对应项
function removeFromArray(arr,compare){
    const index = arr.findIndex(compare)

    if(index > -1){
        arr.splice(index,1)
    }
} 