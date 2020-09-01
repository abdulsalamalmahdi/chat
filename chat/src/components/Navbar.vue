<template>
  <div id="lis">
    <v-toolbar @click="click" dense class="head">
      <ul class="ul">
        <li>
          <router-link to="/">
            <v-img
              height="30"
              width="30      "
              :src="require('../assets/logo.png')"
            />
          </router-link>
        </li>

        <li>
          <router-link v-if="loggedIn" to="/profile">Profile</router-link>
        </li>
        <li v-if="!loggedIn">
          <router-link  to="/register">Sign up</router-link>
        </li>
        <li v-if="!loggedIn">
          <router-link  to="/Login">Log in</router-link>
        </li>
        <li>
          <router-link v-if="loggedIn" to="/About">About</router-link>
        </li>
        <li>
          <router-link v-if="loggedIn" to="/Logout">Log out</router-link>
        </li>
      </ul>

      <v-spacer></v-spacer>
        
        <p  v-if="dialog" class="search">
          jsdklfjksdjflkj
        </p>
        <v-btn icon v-on:click="showSearch">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <v-btn v-if="loggedIn">
        <Requests :requests="requests.to" class="requests" />
      </v-btn>
    </v-toolbar>

    <router-view :key="$route.path" class="body"/>
  </div>
</template>
<script>
//import Search from './search'
import Requests from "./Requests";
import io from "socket.io-client";
export default {
  name: "Navbar",
  data() {
    return {
      dialog: false,
      name:'',
      requests:{},
      user:{}
    };
  },
  created: function() {
      this.socket = io("http://localhost:3000");
    window.onbeforeunload = () => {
      // this.socket.emit('connection', this.username);
    };

 this.$store
      .dispatch("retrieveUser")
      .then((res) => {
       
        this.user = res.data.user;
         console.log(this.user._id)
       this.socket.emit("fech-requests", {_id: this.user._id})
       this.socket.on("send-requests", (data)=>{
         console.log(data)
         this.requests= data
       })
      })
      .catch(err=> console.log(err))
      
    
    this.socket.emit("connection", {
      data: "we are here sockets suck it.....",
    });
    this.socket.on("user", (data) => {
      console.log(data);
      this.username = data.name;
      this.ready = true;
      this.err = false;
     
    });
  },
  computed: {
    loggedIn() {
     // console.log(this.$store.getters.loggedIn);
      return this.$store.getters.loggedIn;
    },
  },
  methods: {
    showSearch() {
     
      this.dialog= !this.dialog;
      console.log(this.dialog)
   
    // this.$router.push(e);
    },
    click(){
      this.dialog= false; 
     
    }
  },
  components: {
    Requests,
  //  Search,
   
  },
};

</script>

<style scoped>
.ul {
  display: inline-flex;
  list-style-type: none;
}

li {
  margin: 1rem;
}
/* .navbar {
  border: 1px solid black;
} */
.requests {
  z-index: 4000;
}
.search{
  top: 4rem;
  left: 20rem;
  z-index: 3000;
}
.body{
  z-index: -1;
}
.head{
  z-index: 1000;
  height: 2rem;
}
</style>
