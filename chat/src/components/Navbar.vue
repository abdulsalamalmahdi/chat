<template>
  <div>
    <v-toolbar dense>
      <ul class="ul">

           <!-- <li>
          <router-link v-if="loggedIn" to="/Logout">Log out</router-link>
        </li> -->

        <li>
          <router-link v-if="!loggedIn" to="/Signup">Sign up</router-link>
        </li>
        <li>
          <router-link v-if="!loggedIn" to="/Login">Log in</router-link>
        </li>
        <!-- <li>
          <router-link v-if="!loggedIn" to="/About">About</router-link>
        </li> -->
       
      </ul>

      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

        <v-btn v-if="loggedIn.role==='admin'" >
      <Requests  class="requests" />
    </v-btn>
    
    </v-toolbar> 
  
    <router-view :key="$route.path"/>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Requests from "./Requests";
export default {
  name: "Navbar",
  data() {
    return {
      navContentOut: [
        { nav: "Signup" },
        {
          nav: "Login",
          //"Login"
        },
        { nav: "About" },
      ],
      navContentIn: [
        {
          nav: "Logout",
          //"Login"
        },
        { nav: "About" },
      ],
    };
  },
  computed: {
   
        ...mapGetters({ loggedIn: "getAuthenticatedUser" }),
      },

  components: {
    Requests,
  },
};
</script>

<style scoped>
.ul{
  display: inline-flex;
  list-style-type: none;
}

li{
  margin: 1rem
}
.navbar {
  border: 1px solid black;
}
.requests {
  z-index: 4000;
}
</style>
