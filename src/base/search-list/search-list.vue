<template>
  <div class="search-list">
      <transition-group tag="ul" name="list">
          <li class="search-item" v-for="item in searches" @click="selectItem(item)" :key="item">
              <span class="text">{{item}}</span>
              <span class="icon" @click.stop="deleteItem(item)">
                  <i class="icon-delete"></i>
              </span>
          </li>
      </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
      searches:{
          type:Array,
          default:[]
      }
  },
  methods:{
      selectItem(item){
          this.$emit('selectItem',item)   //  基础组件主负责把时间派发出去
      },
      deleteItem(item){
          this.$emit('deleteItem',item)
      }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .search-list
        .search-item
            display:flex
            align-items :center
            height :40px;
            .text
                flex:1
                font-size:$font-size-medium
                color:#aaa
            .icon
                extend-click()
                .icon-delete
                    font-size:$font-size-small
                    color:$color-text-d

</style>

