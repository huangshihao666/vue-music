<template>
    <div class="player">
      <!--normal player  -->
      <transition 
        name="normal"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
              <img :src="currentSong.image" alt="" width="100%" height="100%">
            </div>
            <div class="top">
              <div class="back" @click="back">
                <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div 
              class="middle"
              @touchstart.prevent="bgTouchStart"
              @touchmove.prevent="bgTouchMove"
              @touchend="bgTouchEnd">
              <div class="middle-l" ref="middleLeft">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cdRotate">
                    <img :src="currentSong.image" alt="" class="image">
                  </div>
                  <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">{{playingLyric}}</div>
                  </div>
                </div>
              </div>
              <scroll :data="currentLyric && currentLyric.lines" class="middle-r" ref="lyricList">
                  <div class="lyric-wrapper">
                    <div v-if="currentLyric">
                      <p ref="lyricline" 
                        class="text" 
                        v-for="(line,index) in currentLyric.lines" 
                        :class="{'current':currentLineNum === index}">{{line.txt}}</p>
                    </div>
                  </div>
              </scroll>
            </div>
            <div class="bottom">
              <div class="dot-wrapper">
                <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                <span class="time time-l">{{formate(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar :percent="percent" @progressChange="onProgressMoveChange"></progress-bar>
                </div>
                <span class="time time-r">{{formate(currentSong.duration)}}</span>
              </div>
              <div class="operators">
                <div class="icon i-left" @click="setMode">
                  <i :class="iconMode"></i>
                </div>
                <div class="icon i-left" :class="disableClass">
                  <i class="icon-prev" @click="prev"></i>
                </div>
                <div class="icon i-center" :class="disableClass">
                  <i @click="tooglePlaying" :class="playIcon"></i>
                </div>
                <div class="icon i-right" :class="disableClass">
                  <i class="icon-next" @click="next"></i>
                </div>
                <div class="icon i-right">
                  <i class="icon icon-not-favorite"></i>
                </div>
              </div>
            </div>
        </div>
      </transition>
      <!--mini player  -->
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open" style="display:none;">
          <div class="icon">
            <img :src="currentSong.image" alt="" width="40" height="40" :class="cdRotate">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control">
            <progress-circle :radius="radius" :percent="percent">
              <i @click.stop="tooglePlaying" :class="miniPlayIcon" class="icon-mini"></i>
            </progress-circle>
          </div>
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </transition>
      <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="update" @ended="end"></audio>
    </div>
</template>

 <script type="text/ecmascript-6">
    import {mapGetters,mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'  // animation 插件
    import ProgressBar from 'base/progress-bar/progress-bar'
    import ProgressCircle from 'base/progress-circle/progress-circle'
    import {playMode} from 'common/js/config' 
    import {shuffle} from 'common/js/util'
    import Lyric from 'lyric-parser'
    import Scroll from 'base/scroll/scroll'

    export default {
        created(){
          this.touch = {}
        },
        computed:{
            ...mapGetters([
                'fullScreen',
                'playList',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ]),
            playIcon(){
              return this.playing ? 'icon-pause' : 'icon-play'
            },
            iconMode(){
              return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            miniPlayIcon(){
              return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            cdRotate(){
              return this.playing ? 'play' : 'play pause'
            },
            disableClass(){
              return this.songReady ? '' : 'disable'
            },
            percent(){
              return this.currentTime / this.currentSong.duration   //  播放进度
            }
        },
        data(){
          return {
            songReady:false,  // 切换歌曲时 防止连续点击
            currentTime:0,
            radius:32,    // 圆形进度条半径
            currentLyric:null,  // 当前歌词类
            currentLineNum:0,   // 当前是第几行
            currentShow:'cd',
            playingLyric:''  // 当前播放歌词
          }
        },
        methods:{
          back(){
            this.setFullScreen(false)
          },
          open(){
            this.setFullScreen(true)
          },
          ...mapMutations({   // 改变state中的状态
            setFullScreen:"SET_FULL_SCREEN",
            setPlayState:"SET_PLAYING_STATE",
            setCurrentIndex:"SET_CURRENT_INDEX",
            setPlayMode:'SET_PLAY_MODE',
            setPlayList:'SET_PLAYLIST'
          }),
          // 动画js钩子
          enter(el,done){  // done回调函数
            const {x,y,scale} = this._getPosAndScale()  // 对象结构赋值
            // console.log(x,y,scale)
            let animation = {
              0:{
                transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
              },
              60:{
                transform:`translate3d(0,0,0) scale(1.2)`
              },
              100:{
                transform:`translate3d(0,0,0) scale(1)`
              }
            }
            animations.registerAnimation({
              name:'cd-move',
              animation:animation,
              presets:{
                duration:400,
                easing:'linear'
              }
            })
            animations.runAnimation(this.$refs.cdWrapper,'cd-move',done)
          },
          afterEnter(el){
            animations.unregisterAnimation('cd-move')
            this.$refs.cdWrapper.style.animation = ''
          },
          leave(el,done){
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x,y,scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend',done)
          },
          afterLeave(el){
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style['transform'] = ''
          },
          _getPosAndScale(){
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const smallWidth = 20
            const bigWidth = window.innerWidth * 0.8 / 2
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - paddingBottom
            const scale = smallWidth / bigWidth
            return {
              x,
              y,
              scale
            }
          },
          // 暂停  播放
          tooglePlaying(){
            if(!this.songReady){
              return
            }
            this.$refs.audio.pause()
            this.setPlayState(!this.playing)
            if(this.currentLyric){
              this.currentLyric.togglePlay()
            }
          },
          prev(){
            if(!this.songReady){
              return
            }
            if(this.playList.length === 1){
              this.loop()
              return
            }else{
              let index = this.currentIndex - 1
              if(index == -1){
                index = this.playList.length - 1
              }
              this.setCurrentIndex(index)
              this.songReady = false
            }
            
          },
          next(){
            if(!this.songReady){
              return
            }
            if(this.playList.length === 1){
              this.loop()
              return
            }else{
              let index = this.currentIndex + 1
              if(index == this.playList.length){
                index = 0
              }
              this.setCurrentIndex(index)
              this.songReady = false
            }
            
          },
          end(){
            if(this.mode === playMode.loop){
              this.loop()
            }else{
              this.next()
            }
          },
          loop(){
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if(this.currentLyric){
              this.currentLyric.seek(0)
            }
          },
          setMode(){   // 切换播放模式
            const mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if(mode === playMode.random){
              list = shuffle(this.sequenceList)
            }else{
              list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
          },
          resetCurrentIndex(list){   // 重置当前歌曲
            let index = list.findIndex((item) => {
              return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
          },
          ready(){
            this.songReady = true
          },
          error(){
            this.songReady = true  // 网络错误或歌曲资源错误  保证能正常切换
          },
          update(e){
            // console.log(e)
            this.currentTime = e.target.currentTime
          },
          formate(original){  // 格式化时长
            const min = Math.floor(original / 60)
            const sec = this.zero( Math.floor(original % 60) )
            return `${min}:${sec}`
          },
          zero(n){  // 补0
            if(n < 10){
              return `0${n}`
            }else{
              return n
            }
          },
          onProgressMoveChange(percent){   // touchmove时改变currentTime
            const currentTime = percent * this.currentSong.duration
            this.$refs.audio.currentTime = percent * this.currentSong.duration
            if(!this.playing){
              this.tooglePlaying()
            }
            if(this.currentLyric){
              this.currentLyric.seek(currentTime*1000)
            }
          },
          getLyric(){
            this.currentSong.getLyric().then((lyric) => {
              if(this.currentSong.lyric !== lyric){
                return
              }
              this.currentLyric = new Lyric(lyric,this.handleline)
              if(this.playing){
                this.currentLyric.play()
              }
            }).catch(() => {
              this.currentLyric = null
              this.playingLyric = ''
              this.currentLineNum = 0
            })
          },
          handleline(lineNum,txt){
            this.currentLineNum = lineNum.lineNum
            if(lineNum.lineNum > 5){
              let lineEl = this.$refs.lyricline[lineNum.lineNum - 5]
              this.$refs.lyricList.scrollToElement(lineEl,1000)
            }else{
              this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric = lineNum.txt
          },
          // cd和lyric 切换
          bgTouchStart(e){
            this.touch.init = true
            const touch = e.touches[0]
            this.touch.pageX = touch.pageX
            this.touch.pageY = touch.pageY
          },
          bgTouchMove(e){
            if(!this.touch.init){
              return
            }
            const touch = e.touches[0]
            let deltaX = touch.pageX - this.touch.pageX
            let deltaY = touch.pageY - this.touch.pageY
            let isMove = Math.abs(deltaX) - Math.abs(deltaY)
            if(isMove < 0){  // 横向移动的距离大于纵向移动的距离时才切换
              return
            }
            let left
            let offsetWidth  // move的距离
            left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            offsetWidth = Math.min( 0,Math.max(-window.innerWidth,left + deltaX) )
            this.touch.percent = Math.abs(offsetWidth)/window.innerWidth
            this.$refs.middleLeft.style.opacity = (1 - this.touch.percent)
            this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
          },
          bgTouchEnd(){
            let offsetWidth
            let opacity 
            let time = 300
            if(this.currentShow == 'cd'){
              if(this.touch.percent > 0.1){
                offsetWidth = -window.innerWidth
                opacity = 0
                this.currentShow = 'lyric'
              }else{
                offsetWidth = 0
                opacity = 1
              }
            }else{
              if(this.touch.percent > 0.9){
                offsetWidth = -window.innerWidth
                opacity = 0
              }else{
                offsetWidth = 0
                opacity = 1
                this.currentShow = 'cd'
              }
            }
            this.$refs.middleLeft.style.transition = `all ${time}ms`
            this.$refs.middleLeft.style.opacity = opacity
            this.$refs.lyricList.$el.style.transition = `all ${time}ms`
            this.$refs.lyricList.$el.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
            
          }
        },
        watch:{
          // 监听当前歌曲data  发生改变时播放
          currentSong(newSong,oldSong){
            if(newSong.id === oldSong.id){
              return
            }
            if(this.currentLyric){
              this.currentLyric.stop()  // 清楚之前产生的currentLyric
              this.currentTime = 0
              this.playingLyric = ''
              this.currentLineNum = 0
            }
            // this.$nextTick(() => {
            //   this.$refs.audio.play()
            //   this.setPlayState(true)
            //   this.getLyric()
            // })
            clearTimeout(this.timer)
            this.timer = setTimeout( () => {
              this.$refs.audio.play()
              this.setPlayState(true)
              this.getLyric()
            } ,1000)
          },
          playing(){
            const audio = this.$refs.audio
            this.$nextTick(() => {
              this.playing ? audio.play() : audio.pause()
            })
          }
        },
        components:{
          ProgressBar,
          ProgressCircle,
          Scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>