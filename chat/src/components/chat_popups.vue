<template>
  <v-container>
    <v-row class="chat_box">
      <v-card class="chat_head_name">
        <v-list-item-avatar>
          <v-img src="../../public/default-image.png" alt=""></v-img>
        </v-list-item-avatar>
        <h4 @click="go(userPop._id)"><a href="">{{ userPop.first_name + " " + userPop.last_name }}</a></h4>

        <v-btn
          @click.native="close_chat_head(userPop._id)"
          color="blue"
          x-small
          class="close_btn"
          >x</v-btn
        >
      </v-card>
      <v-card class="chat_body">
        <ul>
          <ol v-for="msg in this.sent" :key="msg._id">
            <div class="sent">
              <p class="text">
              {{ msg.text }}
              </p>
                <p class="details" v-if="msg.seen">
              seen at {{ msg.date.replace(".000Z", "").replace("T", " ") }}
            </p>
            <p class="details" v-else>not seen</p>
            </div>
          </ol>

          <ol v-for="msg in this.received" :key="msg._id">
            <div class="received">
               <p class="text">
              {{ msg.text }} </p>
               <p class="details" v-if="msg.seen">
              seen at {{ msg.date.replace(".000Z", "").replace("T", " ") }}
            </p>
            <p class="details" v-else>not seen</p>
          
            </div>
           
          </ol>
        </ul>
      </v-card>
      <v-card>
        <form @submit.prevent class="form" action="supmit">
          <input
            v-model="text"
            placeholder="say somthing !"
            class="text_field"
          />
          <v-btn @click="submit" class="send_btn" x-small>send</v-btn>
        </form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "chat_popups",
  props: {
    userPop: {
      type: Object,
    },
    _id: {
      type: String,
    },
  },

  data() {
    return {
      sent: [],
      received: [],
      text: "",
    };
  },
  created: async function() {
    console.log(this._id);
    console.log(this.userPop._id);
    await axios
      .post(`/messages/${this._id}`, { receiver_id: this.userPop._id })
      .then((res) => {
        console.log(res);
        this.sent = res.data.sent;
        this.received = res.data.received;
        this.messages = res.data;
        console.log(this.messages.data);
      })
      .catch((err) => console.log(err));
  },

  methods: {
    close_chat_head(_id) {
      this.$emit("close_chat_head", _id);
    },

    submit() {
      console.log(this.text);
      axios.post(`/message`, {
        text: this.text,
        sender: this._id,
        receiver: this.userPop._id,
      });

      this.text = "";
    },

    go(_id){
      this.$router.push(`/${_id}`)
    }
  },
};
</script>

<style scoped>
.chat_box {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 30%;
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
  height: 30%;
  padding: 0;
}
p {
  height: 100%;
  width: 100%;
  margin: 0%;
  background: #efefef;
  border-radius: 10px 10px 10px 0px;
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
.sent {
  background: #efefef;
  border-radius: 30px 10px 10px 0px;;
  font-size: 1.2rem;
  line-height: 1.3;
  border: 1px solid black;
  max-width: inherit;
 padding:.5rem;
 position: relative;
  right: 2rem;
}
.received {
  background: #efefef;
  border-radius: 0px 30px 0px 0px;
  font-size: 1.2rem;
  line-height: 1.3;
  max-width: inherit;
  position: relative;
  left: .5rem;
  border: 1px solid black;
}
ol {
  display: block;
  margin: 1rem;
  border-radius: 10px 10px 10px 0px;
  position: relative;
  overflow: hidden;
}
.details {
  background: #ebe7e7;
  margin: 0rem;
  font-size: 10px;
  border-radius: 10px 10px 10px 0px;
}
.text{
  font-size: 10px;
}
</style>
