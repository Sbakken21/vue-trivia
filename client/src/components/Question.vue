<template>
  <div class="container-fluid h-100">
      <div class="row">
          <div class="col-lg-2 col-sm-4">
              <div class="card card-block card-body text-center">
                <h3><span class="underline">Scores</span></h3>
                <ol>
                    <li class="list-item" v-for="(user, index) in users" :key="index">{{ user.username }}{{ user.userId === id ? ' (you)' : '' }} - {{ user.score }}</li>
                </ol>
              </div>
          </div>
      </div>
      <div class="row justify-content-center my-5">
          <div class="col-6">
              <div class="card card-block card-body text-center">
                <div v-if="question && !turnOver">
                    <div v-if="users[id] && users[id].userId === activeUser">
                        <h1 class="mb-5"><span class="underline">YOUR TURN</span></h1>
                        <h1>{{ countDown }}</h1>
                    </div>
                    <div v-else>
                        <h1 class="mb-5">{{ users[activeUser].username }}'s Turn</h1>
                    </div>
                    <h5><strong class="h3">Category: </strong>{{ question.category }}</h5>
                    <h5><strong class="h3">Difficulty: </strong>{{ question.difficulty.toUpperCase() }}</h5>
                    <div class="col-8 mx-auto mt-5">
                        <h3>{{ htmlDecode(question.question) }}</h3>
                        <hr class="underline">
                        <form v-if="users[id] && users[id].userId === activeUser" v-on:submit.prevent="onSubmit">
                            <div v-for="(choice, index) in question.choices" :key="`choice-${index}`">
                                <input :value="choice" :id="`choice-${index}`" class="form-control" type="radio" v-model="answer">
                                <label :for="`choice-${index}`">{{ htmlDecode(choice) }}</label>
                            </div>
                            <button type="submit" :disabled="!answer" class="btn btn-primary btn-block mt-5">Submit</button>
                        </form>
                        <div v-else>
                            <ul>
                                <li v-for="(choice, index) in question.choices" :key="`choice-${index}`" class="list-item">{{ htmlDecode(choice) }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div v-if="question.correct_answer === answer">
                        <h3>Correct!</h3>
                        <hr class="underline">
                        <h5>{{ htmlDecode(question.question) }}</h5>
                        <h5>Correct Answer: {{ htmlDecode(question.correct_answer) }}</h5>
                    </div>
                    <div v-else>
                        <h3>Incorrect!</h3>
                        <hr class="underline">
                        <h5>{{ htmlDecode(question.question) }}</h5>
                        <h5>Your Answer: {{ htmlDecode(answer) }}</h5>
                        <h5>Correct Answer: {{ htmlDecode(question.correct_answer) }}</h5>
                    </div>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Question',
    data(){
        return {
            users: {},
            activeUser: false,
            id: '',
            answer: '',
            question: '',
            turnOver: false,
            timer: null,
            countDown: 10
        }
    },

    computed: {
        
    },

    methods: {
        onSubmit(){
            this.turnOver = true;
            setTimeout(() => {
                this.$socket.emit('answerSubmit', this.answer);
                this.$socket.emit('getQuestion');
            }, 5000);
        },
        htmlDecode(input){
            const doc = new DOMParser().parseFromString(input, "text/html");
            return doc.documentElement.textContent;
        },
        shuffleChoices(){
            this.question.choices = this.question.incorrect_answers;
            this.question.choices.push(this.question.correct_answer);
            let choices = this.question.choices;
            for(let i = choices.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                let x =  choices[i];
                choices[i] = choices[j];
                choices[j] = x;
            }

        },

        // Timer functions
        countDownTimer(){
            if(this.countDown > 0){
                setTimeout(() => {
                    this.countDown--;
                    this.countDownTimer();
                }, 1000);
            } else {
                this.countDown = 10;
                if(this.id === this.activeUser){
                    this.onSubmit();
                }
            }
        }
        
    },

    sockets: {
        userId(id){
            this.id = id;
        },
        activePlayer(player){
            this.activeUser = player['userId'];
        },
        currentUsers(users){
            this.users = users;
        },
        questionData(question){
            this.question = question;
            this.shuffleChoices();
            this.turnOver = false;
            this.answer = '';
        },
        endGame(){
            this.$router.push({ name: 'score' });
        },
        timer(time){
            this.countDown = time;
            if(this.countDown === 0){
                this.countDown = 10;
                if(this.id === this.activeUser){
                    this.onSubmit();
                }
            }
            if(this.countDown < 0){
                this.countDown = 10;
            }
        }
    },
    beforeCreate(){
        this.$socket.emit('getId');
        this.$socket.emit('getActive');
        this.$socket.emit('allUsers');
        this.$socket.emit('getQuestion');
    },
    mounted(){
    }
}
</script>

<style>
.underline {
    border-bottom: 2px solid white;
}
</style>