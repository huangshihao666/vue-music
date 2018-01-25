<template>
    <div class="progress-bar" ref="progressBar" @click="progressClickChange">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div 
                class="progress-btn-wrapper" 
                ref="progressBtn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchMove"
                @touchend="progressEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

 <script type="text/ecmascript-6">
 
    const PROGRESS_BTN_WIDTH = 16

    export default {
        props:{
            percent:{
                type:Number,
                default:0
            }
        },
        created(){
            this.touch = {}
        },
        methods:{
            progressTouchStart(e){
                this.touch.init = true
                this.touch.startX = e.touches[0].pageX
                this.touch.left = this.$refs.progress.clientWidth
            },
            progressTouchMove(e){
                if(!this.touch.init){
                    return
                }
                const deltaX = e.touches[0].pageX - this.touch.startX  // 横向偏移量
                const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH,Math.max(0,this.touch.left + deltaX))
                this._progressPos(offsetWidth)
            },
            progressEnd(e){
                this.touch.init = false
                this._percentChange()
            },
            progressClickChange(e){
                this.touch.init = false
                // const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
                // const percent = e.offsetX / barWidth
                // 点击progressBtn时 offsetWidth获取不对
                const rect = this.$refs.progressBar.getBoundingClientRect()
                const offsetWidth = e.pageX - rect.left
                this._progressPos(offsetWidth)
                this._percentChange()
            },
            _percentChange(){
                const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
                const percent = this.$refs.progress.clientWidth / barWidth
                this.$emit('progressChange',percent)
            },
            _progressPos(offsetWidth){
                this.$refs.progress.style.width = `${offsetWidth}px`
                this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
            }
        },
        watch:{
            percent(newPercent){   // 监听播放时长和总播放长度的百分比
                if(newPercent >= 0 && !this.touch.init){
                    const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
                    let offsetWidth = newPercent*barWidth
                    this._progressPos(offsetWidth)
                }
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .progress-bar
        height :30px
        .bar-inner
            position :relative
            top :13px
            height :4px
            background :rgba(0,0,0,0.3)
            .progress
                position :absolute
                height :100%
                background:$color-theme
            .progress-btn-wrapper
                position :absolute
                left :-8px
                top :-13px
                width :30px
                height 30px
                .progress-btn
                    position :relative
                    top :7px
                    left :7px
                    box-sizing :border-box
                    width :16px
                    height :16px
                    border:3px solid $color-text
                    border-radius :50%
                    background:$color-theme
</style>
