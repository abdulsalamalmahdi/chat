<template  >
  <div class="body" >
    <v-container v-if="authed" class="d-flex flex-row main ">
      <v-col cols="2" class="container-user-card pa-2">
        <v-img
          class="profiler"
          v-bind:src="user.image"
          alt=""
          aspect-ratio="0.9"
          height="40%"
          width="100%"
        ></v-img>
       
       <v-form class="form">
<v-text-field
            v-if="show"
            v-model="image"
            label="gravatar URL"
            prepend-icon="mdi-link"
          >
          
          </v-text-field>
            <v-btn v-if="show" id="urlBtn" @click.prevent="submit" color="info"><v-icon class="ico">mdi-link</v-icon></v-btn>
       </v-form>
        
        
        <h6> Name: {{user.first_name}} </h6>
        <h6>age: {{user.age}}</h6>
        <h6>work: {{user.work}}</h6>
        <h6>place: {{user.place}}</h6>
      </v-col>

      <v-col class="pa-2 container-left" cols="10">
        <v-col>
          <v-card class="welcome" max-width="fit-content"> welcom: {{user.first_name +' '+ user.last_name}} </v-card>
        </v-col>
        <v-col>
          
            
         
        </v-col>
        <v-col>
          <v-card max-width="fit-content" >
          <v-btn v-if="this.user.role==='client'" v-on:click="clickButton"  color="primary" dark >
    <v-icon>
        mdi-account-plus
    </v-icon>
  </v-btn>
          </v-card>
        </v-col>
      </v-col>
    </v-container>
    <v-container v-else>
      <div>
        <h1>Not A User!!!</h1>
      </div>
    </v-container>

    <v-card> </v-card>

   

  </div>

   

</template>


<script src="/socket.io/socket.io.js"></script>
<script>
import userApi from '../api/user'


//import Uploadbtn from "./buttons/Uploadbtn"
import { mapGetters } from "vuex";
let socket = null;



export default {
  name: "Profile",
  data(){
 
    return {
      show:false,
      image:"",
      isConnected:false,
      socketMsg:'',
      
    }
  },
  
  mounted: function () {
    // `this` points to the vm instance



  },
  computed: {
    
   
     ...mapGetters({ user: "getAuthenticatedUser" }),
    //  auth_user:function(){
      
        
  },
 
 components:{
    
 },

  sockets: {
  
    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data
    },
  connect: function () {
            console.log('socket connected')
        },
        customEmit: function (data) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
        },
    


 methods:{
   onClickBtn(){
     this.show= !this.show
   },
   submit(){
     const image= this.image;
     const _id = this.user.data._id
    
     if (image){

      
      userApi.uploadImage( _id, image)
       .then(result=>{
         const b= result;
         console.log(b)
        // const newImage= res.image;
        // this.$store.dispatch("setImageAction", newImage)


       })
       .catch(err=> console.error(err))
       this.show= !this.show
     }
   },

   pingServer() {
      // Send the "pingServer" event to the server.
       
      
       this.$socket.emit('request', {user_id: this.user._id})
       this.$socket.on('datareturn', data=> {console.log(data)})
     
    },
     clickButton: function (data) {
            // $socket is socket.io-client instance
            console.log("this is bullshit")
            this.$socket.emit('customEmit', data)
        }

 },    
};
</script>

<style scoped>
.main {
  width: 100%;
}
.container-user-card {
  align-self: flex-start;
  width: 40%;
}
.container-left {
  height: 100%;
  width: 100%;
}
.profiler {
  width: 50%;
  height: 50%;
  border: 1px solid black;
  align-self: flex-start;
}
.content {
  display: flex;
  height: 100%;
  width: 100%;
  border: 1px solid rgb(34, 34, 63);
}

.body {
  width: 100%;

}
p {
  padding: 1rem;
  background-color: rgb(212, 167, 167);
  width: 30%;
}
span {
  padding: 1rem;
  background-color: rgb(216, 147, 147);
  width: 30%;
}
.left {
  width: 70%;
  height: 90%;
}
#urlBtn{
  max-width:1rem !important;
  min-width: 1rem;
  height:1rem;
  top:1.5rem;
}
.ico{
  align-self: center;
  bottom:0.2rem;
}
.form{
  display: flex;
}
.welcome{
  font-size: 2rem;
}
</style>
