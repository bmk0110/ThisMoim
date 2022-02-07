import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'

import constants from '../lib/constants'
// 서버
import ChannelDetail from '../page/post/channelDetail.vue'
import Server from '../page/post/server.vue'

// 유저
import Login from '../page/user/Login.vue'
import Join from '../page/user/Join.vue'
import JoinDone from '../page/user/JoinDone.vue'
import MyPage from '../page/user/MyPage.vue'

// 포스트
import List from '../page/post/List.vue'
import Board from '../page/post/Test_Board.vue'

// test
import Poll from '../components/common/Poll.vue'
import Map from '../components/module/Map.vue'
import Calendar from '../components/module/Calendar.vue'

Vue.use(Router) 
Vue.use(Vuex)
Vue.use(VueCookie)
 
export default new Router({
  mode: 'history',
  routes: [   
    // 서버 연결
    { 
      path: '/server',
      name: 'server',
      component: Server,
    },
    {
      path: '/channel/:channelId',
      name: 'channelDeatil',
      component: ChannelDetail,
      
      // name: constants.URL_TYPE.POST.TEST_BOARD,
      // component: ChannelDetail  ,
      props: route => ({channelId: Number(route.params.ChannelId)})
    },
    // 로그인/가입
    { 
      path: '/user/login',
      name: constants.URL_TYPE.USER.LOGIN,
      component: Login
    },
    {
      path: '/user/join',
      name: constants.URL_TYPE.USER.JOIN,
      component: Join
    },
    {
      path:'/user/joinDone',
      name: constants.URL_TYPE.USER.JOINDONE,
      component: JoinDone
    },
    {
      path:'/user/MyPage',
      name: constants.URL_TYPE.USER.MYPAGE,
      component: MyPage
    },
    // 포스트
    { 
      path: '/',
      name: constants.URL_TYPE.POST.MAIN,
      component: List,
    },
    { 
      path: '/board',
      name: constants.URL_TYPE.POST.TEST_BOARD,
      component: Board,
    },
    { 
      path: '/error',
      name: constants.ERROR.FRONT_ERROR,
      component: () => import('../page/etc/error.vue'),
    },


    // 그 외 페이지 (404, ERROR)
    {
      path: '*',
      name: 'e404',
      component: () => import('../page/etc/e404.vue')
    },

    //test
    { 
      path: '/poll',
      name: 'poll',
      component: Poll,
    },
    { 
      path: '/map',
      name: 'map',
      component: Map,
    },
    { 
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
    },
  ]
})
