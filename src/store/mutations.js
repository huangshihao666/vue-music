import * as types from './mutations-types'

const mutations = {
	[types.SET_SINGER](state,singer){
		state.singer = singer
	},
	[types.SET_PLAYING_STATE](state,flag){
		state.playing = flag
	},
	[types.SET_FULL_SCREEN](state,flag){
		state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state,list){
		state.playList = list
	},
	[types.SET_SENQUENCELIST](state,list){
		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state,mode){
		state.mode = mode
	},
	[types.SET_CURRENT_INDEX](state,index){
		state.currentIndex = index
	},
	[types.SET_DISC](state,disc){
		state.disc = disc
	},
	[types.SET_TOPLIST](state,list){
		state.topList = list
	},
	[types.SET_SEARCHHISTORY](state,history){
		state.searchHistory = history
	}
}

export default mutations