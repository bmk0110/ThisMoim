<template>
    <div class="user" id="myPage">
        <div class="myBox">
            <div class="middle ">
                <h2>회원 정보 페이지</h2>
                <div class="form-wrap">
                    <img src="https://dummyimage.com/350x350 " alt=""/>
                    <div class="Info">
                        <div class="info-wrap">
                            <label for="email">이메일 : </label>
                            <input id="email" type="text" v-model="email" readonly="readonly">
                        </div>

                        <div class="info-wrap">
                            <label for="nickName">닉네임 : </label>
                            <input v-model="nickName"
                                id="nickName"
                                placeholder="닉네임을 입력해주세요" type="text"
                                />
                        </div>

                        <div class="info-wrap">
                            <label for="password">비밀번호 : </label>    
                            <input v-model="password"
                                id="password" 
                                :type="passwordType"
                                placeholder="비밀번호를 입력해주세요"/>
                            <span :class="{active : passwordType==='text'}">
                                    <i class="fas fa-eye"></i>
                            </span>
                        </div>

                        <div class="info-wrap">
                            <label for="realName">이름 : </label>
                            <input v-model="realName"
                                id="realName"
                                placeholder="이름을 입력해주세요" type="text"/>
                        </div>
                        <div class="info-wrap">
                             <button v-on:click="updateUser">회원정보 수정</button>
                        </div>
                        <div class="info-wrap">
                             <button v-on:click="deleteUser">회원 탈퇴</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
    import '../../assets/css/user.scss'
    import constants from '../../lib/constants'
    import axios from "axios";
    import cookies from 'vue-cookie';
    const vm = this;
    
    export default {
        components: {
        },
        created(){
            const userEmail = this.email;

            this.$nextTick(()=>
                 userEmail = this.email
            );

            this.$nextTick(()=>
                userEmail = this.email,
                this.$store.dispatch(constants.METHODS.GET_USER, {userEmail}),
                this.realName = this.$store.state.name,
                this.nickName = this.$store.state.nickname
            );

            this.$nextTick(()=>
                this.realName = this.$store.state.name
            );
            this.$nextTick(()=>
                this.nickName = this.$store.state.nickname,

                alert(this.$store.state.name)
            );
                
                
            
            
            
            

            
            // const userEmail = this.email;
            // this.$store.dispatch(constants.METHODS.GET_USER, {userEmail});
        },
        methods: {
            check(){
                var passwordExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/;
                if(password.value =='')
                {
                    alert("비밀번호를 입력해주세요");
                    return false;
                }
                else if (passwordExp.test(password.value) == false){
                    alert("비밀번호 형식이 잘못되었습니다.");
                    return false;
                }

                return true;
            },


            deleteUser(){
                if(this.check()){
                    const userInfo = {
                        email: this.email,
                        realName: this.realName,
                        password: this.password,
                        nickName: this.nickName,
                    };
                     this.$store.dispatch(constants.METHODS.DELETE_USER, userInfo);
                }
            },
            updateUser(){
                if(this.check()){
                    const userInfo = {
                        email: this.email,
                        realName: this.realName,
                        password: this.password,
                        nickName: this.nickName,
                    };
                    this.$store.dispatch(constants.METHODS.UPDATE_USER, userInfo);
                }
            },
        },
        computed:{
            
        },
        watch: {
        },
        data: () => {
            return {
                email: cookies.get('Logged'),
                realName: '',
                password:'',
                nickName:'',
                passwordConfirm: '',
                isTerm: false,
                passwordType:"password",
                passwordConfirmType:"password",
                constants
            }
        }

    }

</script>
