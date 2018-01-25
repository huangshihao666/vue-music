<template>
  <div class="loading">
  	<img src="./loading.gif" alt="">
  	<p class="loading-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {   // props 接收父级所传的参数
			title: {
				type:String,
				default:'loading...'
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading
  	width:100%
  	text-align:center
  	img
  		width:24px
  		height:24px
  	.loading-text
  		font-size:$font-size-small
  		color:$color-text-l
  		line-height:20px
</style>
