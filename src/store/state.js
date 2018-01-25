import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const state = {
	singer: {},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[],
	mode:playMode.sequence,
	currentIndex:-1,
	disc:{},  // 歌单详情
	topList:{},  // 排行榜详情
	searchHistory:loadSearch()   //搜索历史数据  初始值应是从本地存储中所取  
}

export default state