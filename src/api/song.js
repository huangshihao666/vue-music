import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid){
    const url = '/api/getLyric'

    const data = Object.assign({},commonParams,{
        pcachetime: +new Date(),
        songmid:mid,
        g_tk:5381,
        loginUin:0,
        hostUin:0,
        needNewCode:0,
        platform:'yqq',
        format:'json'
    })

    return axios.get(url,{
        params:data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}