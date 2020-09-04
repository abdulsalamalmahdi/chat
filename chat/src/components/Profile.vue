<template>
  <div class="body">
    <v-container
      v-if="authed && (this.$route.path === '/profile' || this.user._id === this.$route.params.id)"
      class=" container d-flex flex-row main"
    >
      <v-col cols="2" class="container-user-card pa-2">
        <v-img
          :src="this.image"
          class="profiler"
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
          <v-btn v-if="show" id="urlBtn" @click.prevent="submit" color="info"
            ><v-icon class="ico">mdi-link</v-icon></v-btn
          >
        </v-form>

        <h6>Name: {{ user.first_name }}</h6>
        <h6>age: {{ user.age }}</h6>
        <h6>work: {{ user.work }}</h6>
        <h6>place: {{ user.place }}</h6>
      </v-col>

      <!-- <v-col> -->
      <v-card class="welcome">
        welcom: {{ user.first_name + " " + user.last_name }}
      </v-card>
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-card>
            <Requests :msgs="messages" />
          </v-card>  -->

      <v-spacer> </v-spacer>

      <Friends class="friends" @openPopup="openPopup" :friends="this.friends" />

      <!-- <v-col>
          <v-card max-width="fit-content">
            <v-btn
              v-if="this.user.role === 'client'"
              v-on:click="clickButton"
              color="primary"
              dark
            >
              <v-icon>
                mdi-account-plus
              </v-icon>
            </v-btn>
          </v-card>
        </v-col> -->
      <!-- </v-col> -->
    </v-container>
    <v-container v-else-if="this.$route.params._id !== 'undefined'">
      watching someone else profile
      <v-row>
        <v-col cols="2" class="container-user-card pa-2">
          <v-img
            :src="this.image"
            class="profiler"
            alt=""
            aspect-ratio="0.9"
            height="40%"
            width="100%"
          ></v-img>

          <h6>age: {{ visited_user.age }}</h6>
          <h6>work: {{ visited_user.work }}</h6>
          <h6>place: {{ visited_user.place }}</h6>
        </v-col>

        <v-col class="ml-12">
          <h1>{{ visited_user.first_name }}</h1>
          <v-btn v-if="this.user.friends.find(friend=> friend._id !== this.$route.params.id)" :disabled="requested" @click="friendRequest"
            ><v-icon> mdi-account-plus</v-icon> add Friend
            </v-btn>
            <v-btn  v-if="this.user.friends.find(friend=> friend._id === this.$route.params.id)" :disabled="requested" @click="unfriend(visited_user._id, user._id)"
            ><v-icon> mdi-account-minus</v-icon> Unfriend
            </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="!authed">
      <div>
        <h1>Not A User!!!</h1>
        <v-btn @click="logIn">
          log in
        </v-btn>
      </div>
    </v-container>
    <!-- <v-container fluid style="position: relative;height: fit-content;top: 65%; " > -->

    <v-row
      align="end"
      justify="end"
      class="grey lighten-5"
      style=" display: flex; position: relative ;height: 30%;top: 65%; flex-diretcion: row-reverse;"
    >
      <v-card
        v-for="userPop in usersPops"
        :key="userPop._id"
        :id="userPop._id"
        outlined
        tile
        style="float: right; height: 100%; width: 320px;margin-right: 1rem ;"
      >
        <chatPopups
          @close_chat_head="close_chat_head"
          :userPop="userPop"
          :_id="user._id"
          :messages="messages"
        />
      </v-card>

      <!-- <v-card
        v-for="userPop in usersPops"
        :key="userPop._id"
        :id="userPop._id"
        outlined
        tile
        style="float: right; height: 100%; width: 320px;margin-right: 1rem ;"
      >
        <v-row class="chat_box">
          <v-card class="chat_head_name">
            <v-list-item-avatar>
              <v-img src="../../public/default-image.png" alt=""></v-img>
            </v-list-item-avatar>
            <h4>{{ userPop.email }}</h4>

            <v-btn
              @click.native="close_chat_head(userPop._id)"
              color="blue"
              x-small
              class="close_btn"
              >x</v-btn
            >
          </v-card>
          <v-card class="chat_body">
            <ul v-for="msg in messages" :key="msg._id">
              <ol >
                <p>{{msg.text}}</p>
                
              </ol>
            </ul>
          </v-card>
          <v-card>
            <form class="form" action="supmit">
              <input placeholder="say somthing !" class="text_field" />
              <v-btn class="send_btn" x-small>send</v-btn>
            </form>
          </v-card>
        </v-row>
      </v-card> -->
    </v-row>

    <v-col cols="12"> </v-col>

    <!-- </v-container> -->
  </div>
</template>

<script src="/socket.io/socket.io.js"></script>
<script>
import io from "socket.io-client";
let c = [];
import Requests from "./Requests";
import Drawer from "./drawer";
import Friends from "./friends";
import chatPopups from "./chat_popups";

//import Uploadbtn from "./buttons/Uploadbtn"

let socket = null;

export default {
  name: "Profile",
  data() {
    return {
      show: false,
      isConnected: false,
      socketMsg: "",
      user: {},
      visited_user: {},
      users: [],
      friends: [],
      messages: [],
      image: "",
      popup_count: "",
      popups: [],
      error: "",
      requested:false,
    };
  },

  created: async function() {
    this.socket = io("http://localhost:3000");
   this.socket.emit('connection', {data: 'connection to socket established'})
    
      await this.$store
        .dispatch("retrieveUser")
        .then(async (res) => {
          await console.log(res);
          this.user = res.data.user;

          this.messages = res.data.messages;
          this.image = !this.user.image
            ? "/default-image.png"
            : this.user.image;
          
          this.friends = res.data.user.friends;
           await console.log(this.friends)
        })
        .catch((err) => {
          console.log(err.message.includes("401"));
          if (err.message.includes("401")) {
            this.error = "unautherized";
            this.$router.push("/login");
          }
        });
    
    {
    }
       
     
    this.$store
      .dispatch("retrieveUsers")
      .then(async (res) => {
        //  await console.log(res.data);
        this.users = res.data;
        this.visited_user = await this.users.find(
          (el) => el._id === this.$route.params.id
        );
        console.log(this.user._id)
        console.log(this.visited_user._id)
        this.image = !this.visited_user.image
          ? "/default-image.png"
          : this.visited_user.image;
      })
      .catch((err) => {
        console.log(err.message);
        this.error = err.message;
      });
  },
  computed: {
    authed() {
      // console.log(this.$store.getters.loggedIn)
      return this.$store.getters.loggedIn;
    },
    usersPops() {
      const pops = this.popups
        .map((popup) => this.users.find((user) => user._id === popup))
        .reverse();
      // console.log(pops);
      return pops;
    },
  },

  components: {
    Requests,
    Drawer,
    Friends,
    chatPopups,
  },

  sockets: {
    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
    },
    connect: function() {
      console.log("socket connected");
    },
    customEmit: function(data) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    },
  },

  methods: {
    openPopup(id) {
      const anew = c.find((el) => id === el);
      const width = window.innerWidth;
      this.popup_count = Math.round(width / 320);

      //   console.log(this.popup_count);
      if (!anew) {
        c.push(id);
        // console.log(c);

        this.popups = c;
        // console.log(this.popups);
        if (this.popups.length > this.popup_count) {
          const elEndx = c.indexOf(id);
          //  console.log('index of id is ' + elEndx)

          document
            .getElementById(`${this.popups[c.length - elEndx]}`)
            .setAttribute("class", "hidden");
        }
      }
    },

    close_chat_head(id) {
      //  console.log("closed");
      const toClose = this.popups.find((popup) => popup === id);
      const index = this.popups.indexOf(toClose);
      this.popups.splice(index, 1);
      //  console.log(this.popups);
      document
        .getElementById(`${this.popups[index - (c.length - 1)]}`)
        .classList.remove("hidden");
    },

    onClickBtn() {
      this.show = !this.show;
    },
    submit() {
      const image = this.image;
      const _id = this.user.data._id;

      if (image) {
        userApi
          .uploadImage(_id, image)
          .then((result) => {
            const b = result;
            console.log(b);
            // const newImage= res.image;
            // this.$store.dispatch("setImageAction", newImage)
          })
          .catch((err) => console.error(err));
        this.show = !this.show;
      }
    },
    logIn() {
      this.$router.push("/login");
    },
    friendRequest() {
      // Send the "pingServer" event to the server.
 
      this.socket.emit("friend-request", {
        requester: this.user._id,
        recepient: this.visited_user._id,
      });
      this.requested= true;
    },
    unfriend(friend_id, user_id) {
      // $socket is socket.io-client instance
   
      this.socket.emit("unfriend", {friend_id, user_id});
    },
  },
};
</script>

<style scoped>
.container {
  width: inherit;
}
.main {
  width: 100%;
}
.container-user-card {
  align-self: flex-start;
  width: 40%;
  right: 40rem;
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
  position: relative;
  width: 100%;
  z-index: 2;
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
#urlBtn {
  max-width: 1rem !important;
  min-width: 1rem;
  height: 1rem;
  top: 1.5rem;
}
.ico {
  align-self: center;
  bottom: 0.2rem;
}
.form {
  display: flex;
}
.welcome {
  font-size: 2rem;
  width: fit-content;
  height: fit-content;
}

/* .popup-box {
  display: -moz-popup;
  position: fixed;
  bottom: 0px;
  right: 220px;
  height: 285px;
  background-color: rgb(237, 239, 244);
  width: 300px;
  border: 1px solid rgba(29, 49, 91, 0.3);
}

.popup-box .popup-head {
  background-color: #6d84b4;
  padding: 5px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  clear: both;
}

.popup-box .popup-head .popup-head-left {
  float: left;
}

.popup-box .popup-head .popup-head-right {
  float: right;
  opacity: 0.5;
}

.popup-box .popup-head .popup-head-right a {
  text-decoration: none;
  color: inherit;
}

.popup-box .popup-body {
  height: 100%;
  overflow-y: scroll;
}

.chat-container{
  top:70%;
} */

.chat_box {
  padding: 0;

  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 100%;
}
.chat_header {
}
.chat_head_name {
  background-color: rgb(73, 176, 223);
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1%;
}
h4 {
  width: 60%;
  margin-top: 5%;
  margin-right: 5rem;
}
.chat_body {
  border: 1px solid black;
  height: 100%;
  width: 100%;
  background-color: gray;
  padding: 0;
}
p {
  height: 100%;
  width: 100%;
  margin: 0%;
  background-color: white;
}
.close_btn {
  margin-top: 5%;
}
.form {
  padding: 0%;
}
.text_field {
  width: 75%;
}
.send_btn {
  margin-left: 1rem;
}
.hidden {
  display: none;
}
.friends {
  position: relative;
  left: 23%;
  bottom: 1rem;
  width: 100%;
  z-index: 4000;
}
</style>
