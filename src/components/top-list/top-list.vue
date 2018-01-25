<template>
    <transition name="slide">
        <music-list :rank="rank" :title="topTitle" :bg-image="bgImage" :songs="rankSongList"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import {getRankSongList} from 'api/rank'
import {creatSong} from 'common/js/song'
import {ERR_OK} from 'api/config'

export default {
    computed: {
        ...mapGetters([
            'topList'
        ]),
        topTitle() {
            return this.topList.topTitle
        },
        bgImage() {
            if(this.rankSongList.length){
                return this.rankSongList[0].image
            }
        }
    },
    created(){
        this._getRankSongList()
    },
    data(){
        return {
            rankSongList:[],
            rank:true   // 显示排名
        }
    },
    methods:{
        _getRankSongList(){
            if(!this.topList.id){
                this.$router.push({
                    path:'/rank'
                })
                return
            }
            getRankSongList(this.topList.id).then((res) => {
                if(res.code == ERR_OK){
                    this.rankSongList = this._normalSongList(res.songlist)
                }
            })
            
        },
        _normalSongList(list){
            let ret = []
            list.forEach((item) => {
                if(item.data.songid && item.data.albumid){
                    ret.push( creatSong(item.data) )
                }
            })
            return ret
        }
    },
    components: {
        MusicList
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active,.slide-leave-active
        transition: all 0.3s ease

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
