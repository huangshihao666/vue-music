<template>
	<div ref="wrapper">
		<slot></slot>	
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll' // github better-scroll by huangyi

	export default {
		props:{
			probeType: {
				type:Number,
				default:1
			},
			click:{
				type:Boolean,
				default:true
			},
			data:{
				type:Array,
				default:null
			},
			listenScroll:{   // 监听scroll
				type:Boolean,
				default:false
			},
			pullup:{    // 上拉加载
				type:Boolean,
				default:false
			}
		},
		mounted(){
			setTimeout(() => {  // 保证DOM已经生成
				this._initScroll()
			},20)
		},
		methods:{
			_initScroll(){
				if(!this.$refs.wrapper){
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click:this.click
				})
				// 监听scroll的滚动事件
				if(this.listenScroll){
					let me = this
					this.scroll.on('scroll',(pos) => {
						me.$emit('scroll',pos)  // $emit派发一个事件 父组件可以监听
					})
				}
				// 监听scrollEnd事件
				if(this.pullup){
					this.scroll.on('scrollEnd',() => {
						if( this.scroll.y <= (this.scroll.maxScrollY + 50) ){
							this.$emit('scrollToEnd')  // 只派发一个滚动到底部的事件  不在此做业务逻辑
						}
					})
				} 
			},
			enable(){
				this.scroll && this.scroll.enable()
			},
			disable(){
				this.scroll && this.scroll.disable()
			},
			refresh(){
				this.scroll && this.scroll.refresh()
			},
			scrollTo(){
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
			},
			scrollToElement(){
				this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
		},
		watch:{
			data(){
				setTimeout(() => {
					this.refresh()
				},20)
			}
		}
	}
</script>