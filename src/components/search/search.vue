<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @searchText="onChangeQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutwrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list 
            :searches="searchHistory" 
            v-show="searchHistory.length"
            @selectItem="addQuery"
            @deleteItem="deleteSearchOne"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="suggestresult">
      <suggest :query="query" @select="saveSearch" ref="suggestCom"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空搜索历史？" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import {getHotList} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from '../suggest/suggest'
import {mapActions} from 'vuex'
import {mapGetters} from 'vuex'
import searchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins:[playlistMixin],
  computed:{
    shortcut(){   // 由于 hotkey和searchHistory 都是异步获取的 所以要连接起来  这样其中有一项变化 scroll都会refresh
      return this.hotKey.concat(this.searchHistory)   
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  data(){
    return {
      hotKey:[],
      query:''
    }
  },
  created(){
    this._getHotList()
  },
  methods:{
    handlePlayList(playList){   // 与底部mini播放器高度自适应
      const bottom = playList.length > 0 ? '60px' : 0
      this.$refs.shortcutwrapper.style.bottom = bottom
      this.$refs.suggestresult.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.suggestCom.refresh()
    },
    _getHotList(){
      getHotList().then((res) => {
        if(res.code === ERR_OK){
          this.hotKey = res.data.hotkey.slice(0,10)
        }
      })
    },
    addQuery(k){
      this.$refs.searchBox.setQuery(k)
    },
    onChangeQuery(query){
      this.query = query
    },
    saveSearch(){    // 保存搜索历史的数据
      this.saveSearchHistory(this.query)
    },
    deleteSearchOne(item){  // 删除当前这条数据
      this.deleteSearchHistory(item)
    },
    showConfirm(){   //  清空搜索历史
      this.$refs.confirm.show()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
    
  },
  watch:{
    query(newQuery){
      if(!newQuery){
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        },20)
      }
    }
  },
  components: {
    SearchBox,
    Scroll,
    Suggest,
    searchList,
    Confirm,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
