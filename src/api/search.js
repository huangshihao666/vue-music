
import {commonParams} from './config'
import axios from 'axios'

export function getHotList(){
    const url = '/api/getHotSearch'

    const data = Object.assign({},commonParams,{
        uin:0,
        needNewCode:1,
        platform:'h5',
        format:'json'
    })

    return axios.get(url,{
        params:data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function searchResult(query,zhida,page,prepage){
    const url = '/api/searchResult'

    const data = Object.assign({},commonParams,{
        w:query,
        p:page,
        catZhida:zhida ? 1 : 0,
        prepage,
        n:prepage,
        uin:0,
        format:'json',
        platform:'h5',
        needNewCode:1,
        zhidaqu:1,
        t:0,
        flag:1,
        ie:'utf-8',
        sem:1,
        aggr:0,
        remoteplace:'txt.mqq.all'
    })

    return axios.get(url,{
        params:data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}