import Vue from 'vue';
import axios from 'axios'
import Vuex from 'vuex';
import cookies from 'vue-cookie';
import constants from './lib/constants.js'
import router from './router/index.js'
import http from './http-common.js';
import * as Cookies from 'js-cookie'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: {
            getItem: key => Cookies.get(key),
            setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
            removeItem: key => Cookies.remove(key)
        }
    })],
    state: {
        host: 'http://127.0.0.1:3000',
        token: '',
        role: '',
        email: '',
        name: '',
        password: '',
        nickname: '',
        errorcode: '',
        modal: false,
        // 카카오맵 
        map: {
          isPresent: false, 
          left: '0px',
          top: '0px',
          coord: {
            place_name: '멀티캠퍼스',
            x: 127.0396,
            y: 37.5013,
          },
        },
        // 캘린더
        calendar: {
            event: {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                hasTime: '',
                content: '',
                title: '',
            },
            events: [],
            dialog: false,
            eventDetail: false,
        },
    },
    actions: {
        async REQUEST_ADD_EVENT(context, event) {
            try {
                console.log(event);
                // const response = await requestAddEvent(calendar);
                // const addedEvent = makeEvent(response.data);
                const addedEvent = makeEvent(event);
                context.commit('ADD_EVENT', addedEvent);
                // store.commit('SET_SNACKBAR', setSnackBarInfo('일정이 추가 되었습니다.', 'info', 'top'))
            } catch (e) {
                console.log('일정 추가 에러' + e);
            }

            function makeEvent(event) {
                // const start = new Date(`${event.startDate}T${event.startTime}:00`);
                // const end = new Date(`${event.endDate}T${event.endTime}:00`);
                const start = `${event.startDate}T${event.startTime}:00`;
                const end = `${event.endDate}T${event.endTime}:00`;
                return {
                    name: event.title,
                    start: start,
                    end: end,
                    // start: event.startDate + getTime(event.startTime),
                    // end: event.endDate + getTime(event.endTime),
                    // color: colors[Math.floor(Math.random() * 6)]
                }
            }
        },

        
        [constants.METHODS.DELETE_USER]: (store, payload) => {
            alert(email.value + " and " + password.value);
            http.put('/account/delete',
                {
                    email: payload.email,
                    password: payload.password,
                    nickname: payload.nickName,
                    name: payload.realName
                }
            )
                .then(() => {
                    console.log("delete req success");
                    cookies.delete('Logged');
                    store.commit(constants.METHODS.DELETE_USER);
                    alert("탈퇴되었습니다. 메인 화면으로 돌아갑니다.");
                    router.push('/');
                })
                .catch(exp => {
                    router.push('/error');
                    store.commit(constants.METHODS.ERROR, exp)
                    console.log(exp);
                });

        },
        [constants.METHODS.UPDATE_USER]: (store, payload) => {
            axios.put('http://localhost:8080/account',
                {
                    email: payload.email,
                    password: payload.password,
                    nickname: payload.nickName,
                    name: payload.realName
                }
            )
                .then(() => {
                    console.log("update req success");
                    alert("수정되었습니다.");
                })
                .catch(exp => {
                    router.push('/error');
                    console.log("error is");
                    console.log(exp);
                    store.commit(constants.METHODS.ERROR, exp)
                });
        },
        [constants.METHODS.LOGIN_USER]: (_store, payload) => {

            http
                .get("/account/login", {
                    params: {
                        email: payload.email,
                        password: payload.password
                    }
                })
                .then(res => {
                    console.log(res);
                    if (res.status == 200) {
                        cookies.set('Logged', res.data.email);
                        store.commit(constants.METHODS.LOGIN_USER, payload);
                        return true;
                    }
                })
                .catch(err => {
                    alert("로그인 정보가 잘못되었습니다.");
                    return false;
                });

            return false;
        },
        [constants.METHODS.LOGOUT_USER]: (store) => {
            cookies.delete('Logged');
            store.commit(constants.METHODS.LOGOUT_USER);

        },
        [constants.METHODS.CREATE_USER]: (_store, payload) => {
            const url = '/account/signup';
            const data = {
                "email": payload.email.value,
                "name": payload.realName.value,
                "nickname": payload.nickName.value,
                "password": payload.password.value,
            };
            console.log(data);

            http.post(url, data
            )
                .then(() => console.log("create req success"))
                .catch(exp => {
                    router.push('/error');
                    store.commit(constants.METHODS.ERROR, exp)
                    console.log(exp);
                });
        },
        [constants.METHODS.GET_USER]: (store, payload) => {
            console.log("data : " + payload.userEmail);

            const url = '/account';
            // const data = {
            //     email: payload.userEmail
            // };
            const data2 = "test@test.com";
            http.post('http://localhost:8080/account', payload.userEmail)
                // http.post(url, data)
                .then(res => {
                    const dataWhatINeed = res.data;
                    console.log(dataWhatINeed);
                    store.commit(constants.METHODS.GET_USER, {
                        dataWhatINeed
                    })
                })
                .catch(exp => {
                    router.push('/error');
                    store.commit(constants.METHODS.ERROR, exp)
                    console.log(exp);
                });
        },

    },
    mutations: {
        OPEN_CALENDAR_DIALOG(state, payload) {
            state.calendar.event.startDate = payload.date;
            state.calendar.event.endDate = payload.date;
            state.calendar.event.startTime = payload.time;
            state.calendar.hasTime = payload.hasTime;
            state.calendar.dialog = true;
        },
        CLOSE_CALENDAR_DIALOG(state) {
            console.log("CLOSE_DIALOG");
            state.calendar.dialog = false;
        },
        ADD_EVENT(state, getEvent) {
            console.log("ADD_EVENT");
            state.calendar.events.push(getEvent);
            state.calendar.dialog = false;
            state.calendar.event = {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                hasTime: '',
                content: '',
                title: '',
            };
        },
        OPEN_CALENDAR_EVENT(state, payload) { 
            state.calendar.event = {
                startDate: payload.eventParsed.start.date,
                startTime: payload.eventParsed.start.time,
                endDate: payload.eventParsed.end.date,
                endTime: payload.eventParsed.end.time,
                content: '',
                title: payload.event.name,
            }
            state.calendar.eventDetail = true;
        },
        CLOSE_CALENDAR_EVENT(state) {
            state.calendar.event = {
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                hasTime: '',
                content: '',
                title: '',
            };
            state.calendar.eventDetail = false;
            
        },
        [constants.METHODS.LOGIN_USER]: (state, payload) => {
            state.email = payload.email;
            state.password = payload.password;
            state.modal = !state.modal;
        },
        [constants.METHODS.LOGOUT_USER]: (state) => {
            state.email = '';
            state.password = '';
        },
        [constants.METHODS.GET_USER]: (state, payload) => {
            console.log(payload);
            state.email = payload.dataWhatINeed.email;
            state.password = payload.dataWhatINeed.password;
            state.nickname = payload.dataWhatINeed.nickname;
            state.name = payload.dataWhatINeed.name;
        },
        [constants.METHODS.DELETE_USER]: (state) => {
            state.email = "";
            state.password = "";
            state.nickname = "";
            state.name = "";
        },
        [constants.METHODS.ERROR]: (state, exp) => {
            state.errorcode = exp;
        },

    },
});