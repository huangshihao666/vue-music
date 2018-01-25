<template>
	<div class="recommend-container" ref="recommend">
		<scroll :data="songsList" class="recommend-content" ref="listview">
			<div>
				<slider :sliderData='recommendData.slider'></slider>
				<h2 class="recom-title">热门歌单推荐</h2>
				<div class="songs-list">
					<div @click="selectItem(song)" class="songs-item" v-for="song in songsList" :key="song.id">
						<div class="img">
							<img v-lazy="song.imgurl" alt="">
						</div>
						<div class="decrible">
							<div class="title">{{song.author}}</div>
							<div class="detaile">{{song.dissname}}</div>
						</div>
					</div>
				</div>
				<loading v-show="!songsList.length"></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import Loading from 'base/loading/loading'
	import Scroll from 'base/scroll/scroll'
	import Slider from 'base/slider/slider'
	import {getSongsList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import axios from 'axios'  // 引入ajax第三方插件
	import {playlistMixin} from 'common/js/mixin'
	import {mapMutations} from 'vuex'

	export default {
		mixins:[playlistMixin],
		data(){
			return {
				recommendData:{},
				songsList:[]
			}
		},
		created() {  // 实例已经创建完成之后被调用的钩子函数
			this.getRecommendData()  // 轮播数据 ajax

			setTimeout(() => {
				this._getSongsList()  // 歌单数据 jsonp
			},500)
		},
		methods: {
			handlePlayList(playList){
				const bottom = playList.length > 0 ? '60px' : 0
				this.$refs.recommend.style.bottom = bottom
				this.$refs.listview.refresh()
			},
			...mapMutations({
				setDisc:'SET_DISC'
			}),
			selectItem(song){
				this.$router.push({
					path:`/recommend/${song.dissid}`
				})
				this.setDisc(song)
			},
			getRecommendData(){  // 请求推荐页data
				axios.get('/swiper/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',{
					params: {
						g_tk:5381,
						uin:0,
						format:'json',
						inCharset:'utf-8',
						outCharset:'utf-8',
						notice:0,
						platform:'h5',
						needNewCode:1
					}
				})
				.then((res) => {
					this.recommendData = res.data.data
				})
				.catch((error) => {
					console.log(error)
				})
			},
			_getSongsList(){
				getSongsList().then((res) => {
					if(res.code === ERR_OK){
						// console.log(res.data.hotdiss.list)
						this.songsList = res.data.hotdiss.list
					}else{
						alert(res.message)
					}
				})
			}
		},
		components:{
			Slider,
			Scroll,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable.styl";

	.recommend-container
		position:fixed
		width:100%
		top:88px
		bottom:0
		.recommend-content
			height:100%
			overflow:hidden
			.recom-title
				height:40px
				line-height:40px
				text-align:center
				font-size:$font-size-medium
				color:$color-theme
				letter-spacing:2px
			.songs-list
				.songs-item
					height:80px
					display:flex
					.img
						width:80px
						height:80px
						display:flex
						align-items:center
						justify-content:center
						img
							width:50px
							height:50px
					.decrible
						display:flex
						flex-direction:column
						line-height:1.5
						font-size:$font-size-small
						.title
							padding-top:12px
						.detaile
							padding-top:5px
							color:$color-text-d
</style>