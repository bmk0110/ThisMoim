export default {
    TITLE: 'SSAFY 개발블로그',
    baseUrl: 'http://ec2-54-180-116-157.ap-northeast-2.compute.amazonaws.com:8888',
    LS_KEY: {
        USER_TOKEN: 'userToken',
    },
    ERROR: { 
        FRONT_ERROR: 'FE00' 
    },
    URL_TYPE: {
        USER: {
            LOGIN: 'login',
            JOIN: 'join', 
            JOINDONE: 'joinDone',
            MYPAGE: 'myPage'
        },
        POST: {
            MAIN : "main",
            TEST_BOARD: "test_vue"
        },
    },
    METHODS:{
        DELETE_USER: 'deleteUser',
        UPDATE_USER: 'updateUser',
        LOGIN_USER:  'loginUser',
        LOGOUT_USER: 'logoutUser',
        CREATE_USER: 'createUser',
        GET_USER: 'getUser',
        ERROR:'error',
    }
}

