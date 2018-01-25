<template>
	<div class="swiper-container">
		<swiper :options="swiperOption" ref="mySwiper" class="swiper-box">
	    <!-- slides -->
	    <swiper-slide class="swiper-item" v-for="slider in sliderData" :key="slider.id">
				<a :href="slider.linkUrl">
					<img :src="slider.picUrl" alt="" class="needsclick">
				</a>
	    </swiper-slide>
	    <!-- Optional controls -->
	    <div class="swiper-pagination"  slot="pagination"></div>
	  </swiper>
	</div>
</template>

<script type="text/ecmascript-6">
	import { swiper,swiperSlide } from 'vue-awesome-swiper' // 引入swiper插件

	export default {
		props: ['sliderData'],
	  components: {   // 注册组件
	    swiper,
	    swiperSlide
	  },
	  name: 'carrousel',
	  data() {
      return {
        swiperOption: {   // 配置和swiper官网相同
          notNextTick: true,
          loop:true,
          autoplay: 3000,
          autoplayDisableOnInteraction : false,
          direction : 'horizontal',
          setWrapperSize :true,
          pagination : '.swiper-pagination',
          paginationClickable :true
        }
      }
    }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.swiper-container
	  .swiper-box
	  	width:100%
	  	height:150px
	  	.swiper-item
	  		height:100%
	  		a
	  			display:block
	  			width:100%
	  			height:100%
	  			img
	  				width:100%
	  				height:100%
	  	.swiper-pagination
	  		.swiper-pagination-bullet-active
	  			background:#fff !important
</style>
