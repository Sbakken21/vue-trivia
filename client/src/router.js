import Vue from 'vue';
import Router from 'vue-router';
import Username from './components/Username.vue';
import Lobby from './components/Lobby.vue';
import Question from './components/Question.vue';
import Score from './components/Score.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'username',
            component: Username
        },
        {
            path: '/lobby',
            name: 'lobby',
            component: Lobby
        },
        {
            path: '/questions',
            name: 'questions',
            component: Question
        },
        {
            path: '/score',
            name: 'score',
            component: Score
        }
    ]
});