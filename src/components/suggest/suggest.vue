<template>
    <scroll :data='result' class="suggest" pullup='pullup' @scrollToEnd='searchMore' ref='suggest'>
        <ul class="suggest-list">
            <li 
            class="suggest-item" 
            v-for="item in result" 
            :key='item.id'
            @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper">
          <no-result v-show="!hasMore && !result.length" title="抱歉，没有您搜索的结果！"></no-result>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import { searchResult } from "api/search";
import { ERR_OK } from "api/config";
import { creatSong } from "common/js/song";
import Loading from "base/loading/loading";
import Singer from "common/js/singer";
import { mapMutations,mapActions } from "vuex";
import noResult from 'base/no-result/no-result'

const SINGER_TYPE = "singer";
const prepage = 20;  

export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [], // 搜索结果
      pullup: true, // 开启上拉刷新功能
      hasMore: true // 是否加载完毕
    };
  },
  methods: {
    search() {
      this.hasMore = true;
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      searchResult(
        this.query,
        this.showSinger,
        this.page,
        prepage
      ).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._formatList(res.data);
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      // console.log(this.hasMore);
      // 上拉加载
      if (!this.hasMore) {
        return;
      }
      this.page++;
      searchResult(
        this.query,
        this.showSinger,
        this.page,
        prepage
      ).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._formatList(res.data));
          this._checkMore(res.data);
        }
      });
    },
    selectItem(item) {
        // console.log(item);
      if (item.type == SINGER_TYPE) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      }else{
          this.insertSong(item)
      }
      this.$emit('select')   // 派发一个事件出去 suggest不去处理相关存储搜索历史的数据 由父组件去完成
    },
    refresh(){
      this.$refs.suggest.refresh()
    },
    _formatList(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: SINGER_TYPE } });
      }
      if (data.song) {
        ret = ret.concat(this._normallizeList(data.song.list)); // concat返回一个新数组 需再次赋值给ret
      }
      return ret;
    },
    _normallizeList(list) {
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(creatSong(musicData));
        }
      });
      return ret;
    },
    _checkMore(data) {
      // 检测是否加载完毕
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * prepage > song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    getIconClass(item) {
      if (item.type === SINGER_TYPE) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getName(item) {
      if (item.type === SINGER_TYPE) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions([
        'insertSong'
    ])
  },
  watch: {
    query() {
      this.search();
    }
  },
  components: {
    Scroll,
    Loading,
    noResult
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
        padding: 0 30px;

        .suggest-item {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
        }

        .icon {
            flex: 0 0 30px;
            width: 30px;

            [class^='icon-'] {
                font-size: 14px;
                color: $color-text-d;
            }
        }

        .name {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-d;
            overflow: hidden;

            .text {
                no-wrap();
            }
        }
    }

    .no-result-wrapper {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>


