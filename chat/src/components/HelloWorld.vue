<template>
  <div class="hello">
    <div class="container">
      
      <div class="col-lg-6 offset-lg-3">
        <div v-if="ready">
          <p v-for="user in info" :key="user.id">
            {{ user.username }} {{ user.type }}
          </p>
        </div>

        <div v-if="!ready">
          <h4>Enter your username</h4>
          <form @submit.prevent="addUser">
            <div class="form-group row">
              <input
                type="text"
                class="form-control col-9"
                v-model="username"
                placeholder="Enter username here"
              />
              <input
                type="submit"
                value="Join"
                class="btn btn-sm btn-info ml-1"
              />
            </div>
          </form>
        </div>
        
        <h2 v-else>{{ username }}</h2>
        <v-alert v-if="err" class="alert"  color="red" type="error" > {{err}}</v-alert>
        <div class="card bg-info" v-if="ready">
          <div class="card-header text-white">
            <h4>
              My Chat App
              <span class="float-right">{{ connections }} connections</span>
            </h4>
          </div>
          <ul class="list-group list-group-flush text-right">
            <small v-if="typing" class="text-white">
             
              
              {{ typing }} is typing

 <img src="../assets/typing.gif"
              contain    
    height="20px"
    width="30px">
              </small>
            <li
              class="list-group-item"
              v-for="message in messages"
              :key="message.id"
            >
              <span :class="{ 'float-left': message.type === 1 }">
                {{ message.message }}
                <small>:{{ message.user }}</small>
              </span>
            </li>
          </ul>

          <div class="card-body">
            <form @submit.prevent="send">
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="newMessage"
                  placeholder="Enter message here"
                />
                 <input
                type="submit"
                value="Send"
                class="btn btn-sm btn-info ml-1"
              />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  props: ["users"],
  data() {
    return {
      newMessage: null,
      messages: [],
      typing: false,
      username: null,
      ready: false,
      info: [],
      connections: 0,
      err:null
    };
  },

  created() {
    console.log("created");
    this.socket = io("http://localhost:3000");
    window.onbeforeunload = () => {
      // this.socket.emit('connection', this.username);
    };
    this.socket.emit("connection", {
      data: "we are here sockets suck it.....",
    });
       this.socket.on('user', data => {
         console.log(data)
         this.username= data.name;
         this.ready= true;
         this.err= false;
       })
    //         this.socket.on('chat-message', (data) => {
    //             this.messages.push({
    //                 message: data.message,
    //                 type: 1,
    //                 user: data.user,
    //             });
    //         });

            this.socket.on('sender_typing', (data) => {
              
                this.typing = data.data;
            });

            this.socket.on('stopTyping', () => {
                this.typing = false;
            });

    //         this.socket.on('joined', (data) => {
    //             this.info.push({
    //                 username: data,
    //                 type: 'joined'
    //             });

    //             setTimeout(() => {
    //                 this.info = [];
    //             }, 5000);
    //         });

    //         this.socket.on('leave', (data) => {
    //             this.info.push({
    //                 username: data,
    //                 type: 'left'
    //             });

    //             setTimeout(() => {
    //                 this.info = [];
    //             }, 5000);
    //         });

    //         this.socket.on('connections', (data) => {
    //             this.connections = data;
    //         });
       },

        watch: {
            newMessage(value) {
             
                value ? this.socket.emit('typing', this.username) : this.socket.emit('stopTyping')
            }
  },
  computed(){

  },
  mounted() {
    console.log("mounted");
    this.socket.on("beeb", (data) => {
      console.log(data);
    });
    this.socket.emit("connection", { data: "we are connected realtime baby" });
    
  },
  methods: {
    send() {
        this.messages.push({
            message: this.newMessage,
            type: 0,
            user: 'Me',
        });

        this.socket.emit('chat-message', {
            message: this.newMessage,
            user: this.username
        });
        this.newMessage = null;
    },

    addUser() {
      
      this.socket.emit("joined", this.username);
      this.socket.on('not', (data)=>{
           console.log(data)
           this.err= data
        
       
      });
     
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
