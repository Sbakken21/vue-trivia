<template>
  <section class="container-fluid h-100">
      <div class="row h-100">
          <div class="col-lg-5 mx-auto my-auto">
            <div class="card card-block">
                <h1 class="text-center">Trivia</h1>
                <div class="card-body">
                    <form v-on:submit.prevent="onSubmit">
                        <div class="form-group">
                            <label for="username" class="form-control-label"><strong>Username</strong></label>
                            <input type="text" name="username" :class="{'is-invalid': errors }" class="form-control" v-model="username">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Submit</button>
                    </form>
                </div>
            </div>
          </div>
      </div>
  </section>
</template>

<script>
export default {
    name: 'Username',
    data() {
        return {
            username: '',
            errors: false
        }
    },

    methods: {
        onSubmit() {
            if(!this.username){
                this.$toasted.show("Please enter a username", {
                    duration: 1000,
                    icon: 'exclamation'

                });
                this.errors = true;
            } else {
                this.$socket.emit('addUser', this.username);
                this.$router.push(`/lobby`);
            }
        },
        pingServer(){
            this.$socket.emit('message', 'PING!');
        }
    },
    mounted(){
        this.pingServer();
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

.card {
    background-color: rgba(0,0,0,0.7) !important;
    border: solid 2px white !important;
}

</style>