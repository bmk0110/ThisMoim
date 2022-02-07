<template>
  <v-app>
    <v-main id="bg">
      <Header :isHeader="isHeader"/>
      <!-- <Sidebar :isSidebar="isSidebar"/> -->
      <Sidebar> </Sidebar>
      <router-view id="container"/>
    </v-main>
  </v-app>
</template>

<script>
import './assets/css/style.scss' 
import Header from './components/common/Header.vue'
import Sidebar from './components/common/Sidebar.vue'
import constants from './lib/constants' 
import axios from 'axios'

export default {
  name: 'App',
  components: { 
    Header,
    Sidebar
  },
  created() {
      let url = this.$route.name;

      this.checkUrl(url);
  },
  watch: {
      $route (to){

          this.checkUrl(to.name);
      }
  },
  methods : {
      checkUrl(url) { 
          console.log(url);
          let array = [
              constants.URL_TYPE.USER.LOGIN,
              constants.URL_TYPE.USER.JOIN,
              constants.URL_TYPE.USER.JOINDONE
          ];

          let isHeader = true;
          let isSidebar = true;
          // array.map(path => {
          //     if (url === path)
          //         isHeader = false;
          //         isSidebar = false;
          // })
          this.isHeader = isHeader;
          this.isSidebar = isSidebar;

      },
  },
  data: function () {
        return {
            isHeader: true,
            isSidebar: true,
            constants,
        } 
    }
}
</script>

<style >
  #container{
    /* width: 90vw; */
    /* border: solid gray 1px; */
    background-color: white;
    border-radius: 2%;
    height: 90%;
    margin: 25px;
    padding: 10px;
    margin-left: 50px;
  }
  #bg{
    background-color: rgba(180, 179, 179, 0.26);
  }
</style>