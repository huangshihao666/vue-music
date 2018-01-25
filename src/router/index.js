import Vue from 'vue'
import Router from 'vue-router'

// import Rank from 'components/rank/rank'
// import Recommend from 'components/recommend/recommend'
// import Rearch from 'components/search/search'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'

Vue.use(Router)

// 路由懒加载
const Rank = () => import('components/rank/rank')
const Recommend = () => import('components/recommend/recommend')
const Rearch = () => import('components/search/search')
const Singer = () => import('components/singer/singer')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'   // 设置根路径时加载的组件
    },
    {
      path: '/rank',
      component: Rank,
      children:[{
          path:':id',
          component:TopList
        }]
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[{
        path:':id',
        component:Disc
      }]
    },
    {
      path: '/search',
      component: Rearch,
      children:[{
        path: ':id',
        component:SingerDetail
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children:[{
        path: ':id',
        component:SingerDetail
      }]
    }
  ]
})
