<template>
  	<music-list :songs='songs' :title="title" :bg-image='bgImage'></music-list>
</template>

<script type="text/ecmascript-6">
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import {creatSong} from 'common/js/song'
	import MusicList from 'components/music-list/music-list'

	export default {
		data(){
			return {
				songs:[]
			}
		},
		// 使用对象展开运算符将 getters 混入 computed 对象中
		computed:{
			...mapGetters([
				'singer'
			]),
			title(){
				return this.singer.name
			},
			bgImage(){
				return this.singer.avatar
			}
		},
		created(){
			// console.log(this.singer)
			this._getSingersDetail()  // 请求歌手详情页
		},
		methods:{
			_getSingersDetail(){
				if(!this.singer.id){   // 判断如果id不存在  回退到歌手列表页
					this.$router.push({
						path:'/singer'
					})
					return
				}
				getSingerDetail(this.singer.id).then((res) => {
					if(res.code === ERR_OK){
						this.songs = this.filterSongData(res.data.list)
						// console.log(this.songs)
					}
				})
			},
			filterSongData(list){  // 格式化自己需要的数据
				let ret = []
				list.forEach((item) => {
					let {musicData} = item
					if(musicData.songid && musicData.albummid){
						ret.push(creatSong(musicData))
					}
				})
				return ret
			}
		},
		components:{
			MusicList
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/variable.styl';
	
</style>
