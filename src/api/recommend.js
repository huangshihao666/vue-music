import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'

// 歌单数据请求
export function getSongsList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg'

	const data = Object.assign({},commonParams,{
		tpl:'v12',
		page:'other',
		rnd:Math.random(),
		platform: 'yqq',
		hostUin:0,
		needNewCode:0,
		categoryId:10000000,
		sortId:5,
		sin:0,
		ein:29,
		loginUin:0
	})

	return jsonp(url,data,options)
}

// 歌单详情
export function getSongMeauList(disstid){
	const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
	
		const data = Object.assign({},commonParams,{
			disstid:disstid,
			type:1,
			json:1,
			utf8:1,
			onlysong:0,
			loginUin:0,
			hostUin:0,
			platform:'yqq',
			needNewCode:0,
			jsonpCallBack:'jp'
		})
	
		return jsonp(url,data,options)
}