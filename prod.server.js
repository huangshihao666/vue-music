
var express = require('express')
var config = require('./config/index')

var app = express()
var apiRouters = express.Router()
var axios = require('axios')

// 歌词
apiRouters.get('/getLyric',function(req,res){
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com/',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response) => {
    var ret = response.data
    if(typeof ret === 'string'){
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if(matches){
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
// 排行榜数据
apiRouters.get('/getRankList',function(req,res){
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com/',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
// 热门搜索
apiRouters.get('/getHotSearch',function(req,res){
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com/',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

// 搜索结果
apiRouters.get('/searchResult',function(req,res){
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  axios.get(url,{
    headers:{
      referer:'https://c.y.qq.com/',
      host:'c.y.qq.com'
    },
    params:req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api',apiRouters)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port,function(err) {
    if(err){
        console.log(err)
        return
    }
    console.log('listening at http://localhost:' + port + '\n')
})