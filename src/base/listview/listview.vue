<template>
  <scroll class="listview"
          :data='data'
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="toDetailPage(item)" class="list-group-item" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- touchstart、touchmove为better-scroll插件封装的方法 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" 
            v-for="(item,index) in shortcutList" 
            :class="{'current':currentIndex === index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const SHORTCUT_HEIGHT = 18 // 18是每个字母列表每个item所占的高度
  const TITLE_HEIGHT = 30  
  export default {
    created(){
      this.touch = {} // created时 创建一个空对象 为了使onShortcutTouchStart和onShortcutTouchMove两个方法公用相同的数据
      this.listenScroll = true // 传给scroll组件
      this.listHeight = []
      this.probeType = 3 // 滑动的时候不截流
    },
    data(){
      return {
        scrollY:-1,   // scroll组件 滚动Y轴的距离
        currentIndex:0,   // 当前滚动的歌手列表的group的索引
        diff:-1
      }
    },
    props: {
      data: {
        type:Array,
        default:[]
      }
    },
    // 计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例
    computed: {
      shortcutList(){
        return this.data.map((group) => {
          return group.title.substr(0,1)
        })
      },
      fixedTitle(){
        if(this.scrollY > 0) return
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods:{
      toDetailPage(item){
        // 把点击事件派发出去，因为listview是一个基础组件，不做任何业务相关的逻辑，所以需要把点击事件派发出去在singer组件去出来业务，同时把item作为参数传过去
        this.$emit('select',item)  
      },
      onShortcutTouchStart(e){
        // 字母列表的索引
        let shortcutIndex = getData(e.target,'index')
        this.touch.shortcutIndex = shortcutIndex
        // 第一次按下的 pageY
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        // 歌手列表滚动到当前点击字母位置
        this._scrollTo(shortcutIndex)
      },
      onShortcutTouchMove(e){
        // touchmove 结束后的pageY
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // 计算touchmove过的差值  |0 同Math.floor() 向下取整
        let diffdata = (this.touch.y2 - this.touch.y1) / SHORTCUT_HEIGHT | 0
        // this.touch.shortcutIndex是string 需要转换成 number
        let shortcutIndex = this.touch.shortcutIndex - 0 + diffdata  
        this._scrollTo(shortcutIndex)
      },
      scroll(pos){
        this.scrollY = pos.y
      },
      // 滚动到指定元素  scrollToElement方法是better-scroll插件封装的方法
      _scrollTo(index){
        // console.log(index)
        if(index == null) return  // 点击右边list两端小bug
        if(index < 0) index = 0    // touchmove顶部时index<0 bug
        if(index > (this.listHeight.length -2)){ // touchmove底部时index无限大 bug
          index = this.listHeight.length -2
        }
        this.scrollY = -this.listHeight[index]  // 点击右侧list的item时 当前的高亮
        this.$refs.listview.scrollToElement(this.$refs.listgroup[index],0)
      },
      // 计算每个group的高度
      _calHeight(){
        this.listHeight = []  // 存每个group的高度  再和scroll的高度对比 就可以判断落在哪个区间
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      refresh(){
        this.$refs.listview.refresh()
      }
    },
    watch:{
      data(){
        setTimeout(() => {
          this._calHeight()
        },200)
      },
      scrollY(newY){
        const listHeight = this.listHeight
        // console.log(newY)
        // 1、当滚动到顶部的时候 newY>0 
        if( newY > 0 ){
          this.currentIndex = 0
          return
        }
        // 2、在中间区域滚动的时候
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if( -newY >= height1 && -newY < height2 ){
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 3、滚动到底部的时候 newY可能大于height2
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal){  // title-fixed 切换效果 上下顶的效果
        let fixedTop = ( newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0 )
        if(this.fixedTop === fixedTop){
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components:{
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
</style>
