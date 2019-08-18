<template>
  <div class="container-fluid h-100">
      <div class="row justify-content-center h-100">
          <div class="col-lg-10 my-auto">
              <div class="card card-block card-body text-center">
                  <h3><span class="underline">FINAL SCORES</span></h3>
                  <ul>
                      <li class="list-item" v-for="(user, index) in users" :key="index">{{ user.username }} - {{ user.score }}</li>
                  </ul>
                  <hr class="underline">
                  <h3><span class="underline">WINNER</span></h3>
                  <h3 v-if="sorted.length > 0">{{ sorted[0].username }}</h3>
                  <router-link class="btn btn-primary mt-5" to="/">New Game</router-link>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Score',
    data(){
        return {
            users: [],
            sorted: []
        }
    },

    methods: {
        sortUserScores(){
            // convert users object to array
            Object.keys(this.users).sort((a,b) => {
                return this.users[b].score - this.users[a].score;
            }).forEach((key) => {
                this.sorted.push(this.users[key]);
            });
        }
    },

    sockets: {
        currentUsers(users){
            this.users = users;
            this.sortUserScores();
        }
    },
    mounted(){
        this.$socket.emit('allUsers');
    }
}
</script>

<style>
html, body {
    overflow: hidden;
}

ul {
    list-style-type: none;
}
</style>