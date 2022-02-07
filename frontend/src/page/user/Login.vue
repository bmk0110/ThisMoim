<template>
    <transition name="modal">
        <div class="modal-overlay" @mousedown="$emit('close')">
            <div class="user" id="login">
                <div class="wrapC table" @mousedown.stop>
                    <div class="middle">
                        <h1>SS_log</h1>
                        <slot></slot>

                        <slot name="footer"></slot>

                        <div class="add-option">
                            <div class="wrap">
                                <p>아직 회원이 아니신가요?</p>
                                <router-link v-bind:to="{name:constants.URL_TYPE.USER.JOIN}" class="btn--text">
                                    회원가입
                                </router-link>
                            </div>

                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    </transition>
</template>

<script>
    import '../../assets/css/user.scss';
    import constants from '../../lib/constants';
    
    import cookies from 'vue-cookie';
    import router from 'vue-router';

    
    export default {
        components: {
        },
        created(){
        },
        watch: {
        },
        methods: {
            

        },
        data: () => {
            return {
                constants,
                email: '',
                password: '',
                modal:false

            }
        }

    }
// http://localhost:8080/account/login?email=test@test.com&password=1234

</script>


<style lang="scss" scoped>


.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }


.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s;
}
.modal-window {
  transition: opacity 0.4s, transform 0.4s;
}


.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

</style>