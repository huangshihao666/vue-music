<template>
  <div class="singer-container" ref="singer">
  	<loading v-show="!singersData.length"></loading>
  	<list-view :data='singersData' @select="toDetailPage" ref="list"></list-view>
  	<transition name="slide">
  		<router-view></router-view>
  	</transition>
  </div>
</template>

<script type="text/ecmascript-6">
	import Loading from 'base/loading/loading'
	import {getSingersList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer' 
	import ListView from 'base/listview/listview'
	import {mapMutations} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'

	const HOT_NAME = '热门'
	const HOT_SINGER_LEN = 10  //热门歌手长度

	export default {
		mixins:[playlistMixin],
		data(){
			return{
				singersData:[]
			}
		},
		created(){
			this._getSingersList()  // 请求歌手数据
		},
		methods:{
			handlePlayList(playList){
				const bottom = playList.length > 0 ? '60px' : 0
				this.$refs.singer.style.bottom = bottom
				this.$refs.list.refresh()
			},
			toDetailPage(singer){
				// singer其实是从listview组件派发的item的实例
				// console.log(singer)
				// push这个方法会向 history栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL
				this.$router.push({  
					path: `/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			_getSingersList(){
				getSingersList().then((res) => {
					if(res.code === ERR_OK){
						const list = res.data.list
						console.log(list)
						this.singersData = this.changeSingersData(list)
						// console.log(this.singersData)
					}else{
						console.log(res.message)
					}
				})
			},
			changeSingersData(list){  // 改变数据结构 变成一个有序的数组 按歌手首字母排列
				let map = {
					hot: {
						title:HOT_NAME,
						items:[]
					}
				}
				list.forEach((item,index) => {
					if(index < HOT_SINGER_LEN){  // 热门 10条数据
						map.hot.items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						}))
					}
					const key = item.Findex // 歌手首字母
					if( !map[key] ){
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				})
				console.log(map)
				// map是一个对象 需要转为一个有序数组
				let hot = []
				let rest = []
				for(let key in map){
					let val = map[key]
					if( val.title.match(/[a-zA-Z]/) ){
						rest.push(val)
					}else if( val.title === HOT_NAME ){
						hot.push(val)
					}
				}
				rest.sort((a,b) => {   // 排序
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(rest)
			},
			...mapMutations({    // 使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）
				setSinger:'SET_SINGER'
			})
		},
		components:{
			ListView,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer-container
		position:fixed
		width:100%
		top:88px
		bottom:0
		.slide-enter-active,.slide-leave-active
			transition:.3s
		.slide-enter,.slide-leave-to
			transform:translateX(100%)
			opacity:0
</style>
