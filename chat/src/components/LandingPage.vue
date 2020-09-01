<template>
  <v-app>
    
    <v-main v-if="loggedIn">  
    </v-main>
    <v-main v-else>
      <v-text class="display-4">
        welcome
      </v-text>
     <v-spacer></v-spacer>
      <v-divider></v-divider>
    <v-text class="display-1">
      not a user!!
    </v-text>
    <v-spacer></v-spacer>
    <v-btn @click="signUp">
      sign up
    </v-btn>
    <v-divider class="mb-16"></v-divider>
    <v-spacer></v-spacer>
     <v-text class="display-1"> 
       a user!!
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
    },
     signUp(){
      this.$router.push('/register')
    }
  }
};
</script>