<template>
  <div class="container-fluid h-100">
      <div v-if="Object.keys(users).length > 1" class="row h-100">
          <div class="col-lg-5 mx-auto my-auto">
              <div class="card card-block card-body">
                  <div class="text-center">
                      <h1 class="underline mb-5"><span>LOBBY ({{ Object.keys(users).length }} / 4)</span></h1>
                      <h3 v-for="(user, index) in users" :key="index" class="my-2">{{ user.username }}</h3>
                      <div v-if="id === leader.userId">
                        <button v-on:click="processUsers()" class="btn btn-primary btn-block mt-5">Start</button>
                      </div>
                      <div v-else>
                          <h3>Waiting for lobby leader to start game</h3>
                          <img src="../assets/download.svg" alt="loading">
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div v-else class="row h-100">
        <div class="col-lg-5 mx-auto my-auto">
            <div class="card card-block card-body">
                <div class="text-center">
                    <h1>WAITING FOR OTHER PLAYERS</h1>
                    <img src="../assets/download.svg" alt="loading">
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Lobby',
    data(){
        return {
            loading: false,
            error: null,
            users: {},
            question: {},
            id: '',
            leader: ''
        }
    },
    sockets: {
        currentUsers(users){
            this.users = users;
        },
        redirectUsers(){
            this.$router.push({ name: 'questions' });
        },
        userId(id){
            this.id = id;
        },
        activePlayer(leader){
            this.leader = leader;
        }
    },
    methods: {
        processUsers(){
            this.$socket.emit('getRedirectUsers');
        }
    },
    mounted() {
        this.loading = true;
        this.$socket.emit('getId');
        this.$socket.emit('getActive');
    }
}
</script>

<style>
html, body, #app {
    height: 100%;
    background: url("../assets/ask-blackboard.jpg");
    background-position: center;
    color: white;
}

.underline {
    border-bottom: 2px solid white;
}

.card {
    background-color: rgba(0,0,0,0.7) !important;
    border: solid 2px white !important;
}
</style>