<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>


<script>
import Header from './components/Header';
export default {
  name: 'app',
  components: {
    Header
  },
  data() {
    return {
    }
  },
  mounted(){
  }
}
</script>

<style>
</style>
