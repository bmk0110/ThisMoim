<template>

    <div class="container" id="app" v-cloak>
        <div class="row">
            <div class="col-md-6">
                <h3>채널 리스트</h3>
            </div>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <label class="input-group-text">방제목</label>
            </div>
            <input type="text" class="form-control" v-model="channel_name" v-on:keyup.enter="createChannel">
            <div class="input-group-append">
                <button class="btn btn-primary" type="button" @click="createChannel">채널 개설</button>
            </div>
        </div>
        <ul class="list-group pl-0 mt-5">
            <li class="list-group-item list-group-item-action" v-for="item in channels" v-bind:key="item.channelId" v-on:click="enterRoom(item.channelId, item.channelName)">
                <h6>{{item.channelName}} <span class="badge badge-info badge-pill">{{item.userCount}}</span></h6>
            </li>
        </ul>
    </div>
</template>
 
<script>
    import '../../assets/css/post.scss'
    import constants from '../../lib/constants'
    import SockJS from 'sockjs-client';
    import Stomp from 'stomp-websocket';
    import axios from 'axios';
    import http from '../../http-common.js';

    export default {
        data: () => ({
            channel_name : '',
            channels: []
        }),
            created() {
                this.findAllChannel();
            },
            methods: {
                findAllChannel: function() {
                    http.get('/board/channels').then(response => {
                        // prevent html, allow json array
                        if(Object.prototype.toString.call(response.data) === "[object Array]")
                            this.channels = response.data;
                    });
                },
                createChannel: function() {
                    if("" === this.channel_name) {
                        alert("채널 이름을 입력해 주십시오.");
                        return;
                    } else {
                        var params = new URLSearchParams();
                        params.append('channelName', this.channel_name);
                        http.post('/board/channel', params)
                        .then(
                            response => {
                                alert(response.data.channelName + "채널 개설에 성공하였습니다.")
                                this.channel_name = '';
                                this.findAllChannel();
                            }
                        )
                        .catch( response => { alert("채널 개설에 실패하였습니다."); } );
                    }
                },
                enterRoom: function(channelId, channelName) {
                    localStorage.setItem('wsboard.channelId',channelId);
                    localStorage.setItem('wsboard.channelName',channelName);
                    location.href="/channel/"+channelId;
                }
            }
    }
</script>