import axios from 'axios'
import {commonParams,options} from './config'
import jsonp from 'common/js/jsonp'

// 排行榜数据
export function getRankData(){
    const url = '/api/getRankList'

    const data = Object.assign({},commonParams,{
        uin:0,
        format:'json',
        platform:'h5',
        needNewCode:1
    })

    return axios.get(url,{
        params:data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// 排行榜详情数据
export function getRankSongList(topid){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

    const data = Object.assign({},commonParams,{
        topid,
        uin:0,
        platform:'h5',
        needNewCode:1,
        tpl:3,
        page:'detail',
        type:'top'
    })

    return jsonp(url,data,options)
}
