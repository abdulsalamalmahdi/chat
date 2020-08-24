<template>
  <v-app>
    
    <v-main v-if="loggedIn">
     
      <HelloWorld/>
    </v-main>
    <v-main v-else>
    <v-text>
      not a user!!
    </v-text>
    <v-spacer></v-spacer>
    <v-btn @click="logIn">
      log in
    </v-btn>
    </v-main>
  </v-app>
</template>

<script>



export default {
  name: 'LandingPage',

  components: {
  
   
  },

  data: () => ({
    //
  }),
  computed: {
    loggedIn(){
      return this.$store.getters.loggedIn;
    }
  },
  methods: {
    logIn(){
      this.$router.push('/login')
    }
  }
};
</script>