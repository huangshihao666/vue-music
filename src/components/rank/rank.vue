<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="rankList" ref="toplist">
      <ul>
        <li class="item" v-for="item in rankList" :key="item.id" @click="toTopListPage(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" alt="">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(songItem,index) in item.songList">
              <span>{{index+1}}</span>
              <span>{{songItem.songname + '-' +songItem.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container">
      <loading v-show="!rankList.length"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRankData} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins:[playlistMixin],
    created(){
      this._getRankList()
    },
    data(){
      return {
        rankList:[]
      }
    },
    methods:{
      _getRankList(){
        getRankData().then((res) => {
          if(res.code === ERR_OK){
            this.rankList = res.data.topList
          }
        })
      },
      handlePlayList(playList){
        const bottom = playList.length > 0 ? '60px' : '0'
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      toTopListPage(item){
        this.$router.push({
          path:`/rank/${item.id}`
        })
        this.setTopList(item)
      },
      ...mapMutations({
        setTopList:'SET_TOPLIST'
      })
    },
    components:{
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @imort "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            line-height: 26px
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
