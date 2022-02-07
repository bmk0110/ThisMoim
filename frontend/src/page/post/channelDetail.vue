<template>
  <div id="app" v-cloak @click="cloakMoveable">
    <div class="row">
      <v-snackbar
        app
        top
        v-model="snackbar.isPresent"
        :timeout="snackbar.timeout"
        :color="snackbar.color"
      >{{ snackbar.text }}</v-snackbar>
      <div class="col-md-6">
        <h4>
          {{channelName}}
          <span class="badge badge-info badge-pill">{{userCount}}</span>
          <v-btn @click="sendMessage()">보내기</v-btn>
        </h4>
        <br />
      </div>
    </div>
    <v-toolbar class="toolBox">
      <v-btn icon color="orange" @click="createPostit">
        <v-icon>mdi-message</v-icon>
      </v-btn>
      <!-- <v-btn icon color="orange" @click="createMap">
        <v-icon>mdi-map</v-icon>
      </v-btn> -->
    </v-toolbar>

    <div class="bodyBox" ref="whiteBoard" @dblclick="focusAction" @click="changeTargetAction" @change="sendMessage()">
      
      <Moveable
        ref="moveable"
        class="moveable"
        v-bind="moveable"
        @drag="handleDrag"
        @dragEnd="handleDragEnd"
        @resize="handleResize"
        @scale="handleScale"
        @rotate="handleRotate"
        @warp="handleWarp"
        style="display: none;"
      ></Moveable>

      <!-- <Postit :id="pi.id" :postit="pi" style="position: relative; display: inline-block"/> -->
      <div class="postit"
      v-for="(pi, idx) in this.board.postitList"
      :key="pi.frontPostitId"
      @click.right="deleteTargetAction(idx, $event)">
          <Postit
          :id="pi.frontPostitId"
          :postit="pi"
          :style="{left: pi.left, top: pi.top}"
          />

      </div>
      <div class="map" @click.right="deleteAction">
        <Map v-if="map.isPresent"/>
      </div>

      <v-dialog width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="rgb(255,157,91)"
          style="right:10px; bottom:30px; position:fixed; display:flex"
          dark
          fab
          large
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-message-bulleted</v-icon>
        </v-btn>
      </template>
      <v-card>
        <!-- <v-card-title>
          <span class="headline">채팅</span>
        </v-card-title>-->
        <v-card-text style="padding:16px">
          <Chat/>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
     

  </div>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "stomp-websocket";
import http from "../../http-common.js";
import Moveable from "vue-moveable";
import Postit from "../../components/module/Postit";
import Map from "../../components/module/Map";
import Chat from "../../components/common/Chat";

export default {
  data() {
    return {
      ws: null,
      channelName: "",
      // 소켓 서버 전송
      board: {
        channelId: "",
        idCount: 1,
        postitList: [],
        isDelete: false,
        delete: {
          moduleName: '',
          id: -1,
        },
      },
      token: "",
      userCount: 0,
      moveable: {
        target: "",
        draggable: true,
        throttleDrag: 1,
        resizable: false,
        throttleResize: 1,
        keepRatio: false,
        scalable: true,
        throttleScale: 0,
        rotatable: true,
        throttleRotate: 0,
        origin: false,
      },
      map: {
        isPresent: false,
        left: "",
        top: "",
        lat: 0,
        lng: 0,
      },
      snackbar: {
        isPresent: false,
        text: "",
        timeout: 1000,
      },
    };
  },
  created() {
    this.init();
    window.oncontextmenu = function () {
      // 우클릭 default이벤트 차단
      return false;
    };
    this.initRecv();
  },
  methods: {
    init() {
      var BASE_URL =  "http://i3a510.p.ssafy.io/api"
      //var BASE_URL = "http://localhost:8080";
      var sock = new SockJS(BASE_URL + "/ws-stomp");
      var ws = Stomp.over(sock);
      this.ws = ws;

      this.board.channelId = localStorage.getItem("wsboard.channelId");
      this.channelName = localStorage.getItem("wsboard.channelName");
      var _this = this;
      http.get("/board/user").then((response) => {
        _this.token = response.data.token;
        ws.connect(
          { token: _this.token },
          function (frame) {
            ws.subscribe("/sub/board/channel/" + _this.board.channelId, function (
              message
            ) {
              var recv = JSON.parse(message.body);
              _this.recvMessage(recv);
            });
          },
          function (error) {
            alert("서버 연결에 실패 하였습니다. 다시 접속해 주십시요.");
            location.href = "/";
          }
        );
      });
    },
    initRecv() {
      // 접속시 처음 값을 받아오도록 하기
      http
        .get(`/board/${this.board.channelId}`)
        .then((response) => {
          this.board.postitList = response.data.postitList;
          this.board.idCount = response.data.idCount;
        })
        .catch((e) => {
        });
      this.createSnackbar(
        `'${this.channelName}' 채널에 입장하였습니다!`,
        3000,
        "info"
      );
    },
    sendMessage: function (type) {
      this.ws.send(
        "/pub/board/message",
        { token: this.token },
        JSON.stringify(this.board)
      );
      this.createSnackbar("수정되었습니다", 1000, "warning");
    },
    recvMessage: function (recv) {
      this.userCount = recv.userCount;
      this.board.idCount = recv.idCount;
      this.board.postitList = recv.postitList;
      this.board.isDelete = false;
    },
    createPostit(event) {
      if(this.board.postitList.length > 20) {
        this.createSnackbar("포스트잇이 너무 많습니다!", 3000, "error")
        return
      }
      event.stopPropagation();
      const idc = this.board.idCount++;
      // postitList에 새로운 포스트잇 더하기
      this.board.postitList.unshift({
        frontPostitId: idc,
        left: "500px",
        top: "170px",
        title: "",
        contents: "",
        channel: this.board.channelId,
      });
      this.sendMessage();
      // snackbar
      this.createSnackbar("포스트잇이 생성되었습니다!", 1500, "success");
    },
    createMap(event) {
      if (this.map.isPresent) {
        this.createSnackbar("이미 카카오맵이 있습니다!", 3000, "error");
      } else {
        this.map.isPresent = true;
      }
    },
    createSnackbar(text, timeout, color) {
      this.snackbar.isPresent = true;
      this.snackbar.text = text;
      this.snackbar.timeout = timeout;
      this.snackbar.color = color;
    },
    handleDrag({ target, left, top }) {
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
      this.board.postitList.map((postit) => {
        if (postit.frontPostitId == target.id) {
          (postit.left = `${left}px`), (postit.top = `${top}px`);
        }
        return {
          ...postit,
        };
      });
    },
    handleDragEnd() {
      this.sendMessage();
    },
    handleResize({ target, width, height, delta }) {
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },
    handleScale({ target, transform, scale }) {
      target.style.transform = transform;
    },
    handleRotate({ target, dist, transform }) {
      target.style.transform = transform;
    },
    handleWarp({ target, transform }) {
      target.style.transform = transform;
    },
    focusAction({ target, transform }) {
      target.focus();
    },
    changeTargetAction({ target }) {
      this.blockMoveable();
      if (target.getAttribute("class") != null) {
        var clas = target.getAttribute("class").split(" ");

        for (var cla in clas) {
          if (clas[cla] == "MoveableBox") {
            event.stopPropagation();
            target.blur();
            this.$refs.moveable.moveable.target = target;
          }
        }
      }
    },
    deleteTargetAction(idx, { target }) {
      if (confirm("요소를 삭제하시겠습니까?") === true) {
        target.remove();
        this.board.isDelete = true;
        this.board.delete.moduleName = 'postit';
        this.board.delete.id = this.board.postitList[idx].frontPostitId;
        this.board.postitList.splice(idx, 1);
        this.sendMessage();
        this.cloakMoveable();
      }
    },
    deleteAction({target}) {
      if(confirm("요소를 삭제하시겠습니까?") === true) {
        target.remove();
        this.cloakMoveable();
      }
    },
    blockMoveable() {
      document.querySelector(".moveable-control-box").style.display = "block";
    },
    cloakMoveable() {
      document.querySelector(".moveable-control-box").style.display = "none";
    },
  },
  components: {
    Moveable,
    Postit,
    Map,
    Chat,
  },
};
</script>

<style>
.moveable {
  font-family: "Roboto", sans-serif;
  position: relative;
  width: 300px;
  height: 100px;
  text-align: center;
  font-size: 40px;
  margin: 0 auto;
  font-weight: 100;
  letter-spacing: 1px;
  /* background-color: yellow; */
}
</style>
