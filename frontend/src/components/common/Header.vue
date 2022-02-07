<template>
    <div id="header" v-if="isHeader">
        <h1>
            <router-link v-bind:to="{name:constants.URL_TYPE.POST.MAIN}">
                당신이 찾는 소모임 - 이거모임
            </router-link>
        </h1>
        <div class="right">
            <!-- <div class="search-input">
                <i class="fas fa-search"></i>
                <input v-model="keyword" type="text"/>
            </div>  -->
            
            <!-- <router-link v-bind:to="{name:constants.URL_TYPE.USER.LOGIN}" class="login-btn">
                로그인 
            </router-link>   -->

            
            <!-- <button @click="check">
                store 체크
            </button> -->
            <!-- <p>{{this.$store.state.email}}</p> -->

            <template v-if="this.$store.state.email == ''">
                <div class="headBox">
                    <button @click="openModal">
                        로그인
                    </button>
                </div>
            </template>

            <template v-if="this.$store.state.email != ''">
                <div class="headBox">
                    <router-link v-bind:to="{name:constants.URL_TYPE.USER.MYPAGE}" class="btn--text">
                        {{userData}}
                    </router-link> 

                
                    <button @click="logout">
                        로그아웃
                    </button>
                </div>
            </template>

        </div>  
        
        
            <loginModal @close="closeModal" v-if="modal">
                
                
                <div class="input-wrap">
                        <input v-model="email"
                        id="email" 
                        placeholder="이메일을 입력해주세요"
                        type="text"/>
                    </div>
                    <div class="input-wrap">
                        <input v-model="password" type="password"
                        id="password"
                        placeholder="영문, 숫자 혼용 8자 이상"/>
                    </div>
                
                
                <template slot="footer">
                                <button class="btn btn--back btn--login" v-on:click="testMethod(email, password)">
                                    로그인 하기
                                </button>
                                
                </template>

            </loginModal>
        
    </div>
</template>   

<script> 
    import loginModal from '../../page/user/Login.vue'
    import constants from '../../lib/constants'
    import cookies from 'vue-cookie'

    export default {
        name: 'Header',
        components: { 
            loginModal
        },
        props: ['isHeader'],
        computed:{
            userData(){
                return this.$store.state.email;
            }
            // userinfo:{
            //     get() {
            //         const arr = document.cookie.split(";");
            //         console.log("asdfasdfasdf");

            //         arr.forEach(element => {
            //             if(element.split('=')[0] == 'Logged'){
            //                 userinfo = element.split('=')[1];
            //             }
            //         });
            //     }
            // },

        },
        watch: {
            modal: function(val) {
                console.log(val);
            }
        },
        created() {
            // console.log("arr is ");
            // console.log(arr);
            // const arr = document.cookie.split(";");

            // arr.forEach(element => {
            //     if(element.split('=')[0] == 'Logged'){
            //         this.userinfo = element.split('=')[1];
            //     }
            // });

            // if(document.cookie.split(";")[0].split('=')[0])
            // console.log();

            
        },
        methods : {
            openModal(){
                this.modal = true;
            },
            closeModal(){
                this.modal = false;
            },
            async logout(){
                this.$store.dispatch(constants.METHODS.LOGOUT_USER);
                try{
                   await this.$router.push('/');
                } catch(error) {
                    console.log("route same path!");
                } 
            },
            check(){
                console.log(this.$store.state);
            },
            toggle(){
                this.t = !this.t;
            },
             testMethod(email, password){
                console.log(email,password);

                var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
                if(exptext.test(email)==false){
                    //이메일 형식이 알파벳+숫자@알파벳+숫자.알파벳+숫자 형식이 아닐경우            
                    alert("이메일형식이 올바르지 않습니다.");
                  
                }
                else if(password=='')
                {
                    alert("비밀번호를 입력해주세요");
                }
                else {

                    const result = this.$store.dispatch(constants.METHODS.LOGIN_USER, {email, password});
                    console.log(this.userData);this.modal = !this.modal;
                  
                };

                    
                // this.email = '';
                // this.password = '';
            },
            
        },
        data: function() {
           return {
               constants,
               keyword : "",
               modal:this.$store.state.modal,
               userinfo:this.$store.state.email,
           }
        },

    }


</script>

<style>
    #header{
        border-bottom: 3px solid rgb(223, 223, 223)
    }
</style>




