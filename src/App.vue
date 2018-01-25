<template>
  <div id="app">
  	<m-header></m-header>
  	<tab></tab>
  	<!-- keep-alive 切换页面时防止页面重新渲染 -->
  	<keep-alive>
  		<router-view></router-view>
  	</keep-alive>
		<player></player>
  </div>
</template>

<script type="text/ecmascript-6">
	import MHeader from 'components/m-header/m-header'  // 头部组件
	import Tab from 'components/tab/tab'  // tab导航组件
	import Player from 'components/Player/Player'

	export default {
	  components: {
	    MHeader,
			Tab,
			Player
	  }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  
</style>
