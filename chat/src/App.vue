<template>
  <v-app>
    

    <v-main>
      <Navbar class="nav"/>
      <!-- <LandingPage/> -->
    </v-main>
  </v-app>
</template>

<script>

// import LandingPage from './components/LandingPage'
import Navbar from './components/Navbar'
export default {
  name: 'App',

  components: {
  Navbar,
    // LandingPage,
  },

  data: () => ({
    //
  }),
};
</script>
<style scoped>
.nav{
  z-index: 4000;
}
</style>
