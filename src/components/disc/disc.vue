<template>
  	<music-list :songs="songs" :title="disc.dissname" :bg-image="disc.imgurl"></music-list>
</template>

<script type="text/ecmascript-6">
    import MusicList from 'components/music-list/music-list'
    import {mapGetters} from 'vuex'
    import {getSongMeauList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import {creatSong} from 'common/js/song'

    export default {
        computed:{
            ...mapGetters([
                'disc'
            ])
        },
        created(){
            this._getSongList()
        },
        data(){
            return {
                songs:[]
            }
        },
        methods:{
            // 歌单详情数据请求
            _getSongList(){
                getSongMeauList(this.disc.dissid).then((res) => {
                    if(res.code === ERR_OK){
                        this.songs = this._formatSongData(res.cdlist[0].songlist)
                    }
                })
            },
            // 歌单数据格式化
            _formatSongData(list){
                let ret = []
                list.forEach((musicData) => {
                    if(musicData.albumid && musicData.songid){
                        ret.push(creatSong(musicData))
                    }
                })
                return ret
            }

        },
        components:{
			MusicList
		}
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	
	
</style>
