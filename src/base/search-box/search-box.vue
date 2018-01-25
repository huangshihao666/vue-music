<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="searchText" :placeholder="placeholder"/>
    <i class="icon-dismiss" v-show="searchText" @click="clearSearchText"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from "common/js/util";

export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  created() {
    this.$watch(
      "searchText",
      debounce(newQuery => {
        this.$emit("searchText", newQuery);
      }, 200)
    );
  },
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    clearSearchText() {
      this.searchText = "";
    },
    setQuery(query) {
      this.searchText = query;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-highlight-background;
    border-radius: 6px;

    .icon-search {
        font-size: 24px;
        color: $color-background;
    }

    .box {
        flex: 1;
        margin: 0 5px;
        line-height: 20px;
        background: $color-highlight-background;
        color: $color-text;
        font-size: $font-size-medium;

        &::placeholder {
            color: $color-text-d;
        }
    }

    .icon-dismiss {
        font-size: 16px;
        color: $color-background;
    }
}
</style>
