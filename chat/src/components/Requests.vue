<template>
  <div>

    


    <div class="dropdown">
      <div @click="onclick" class="dropbtn">
       Friends Requests
        <span class="circle">{{requests.length}}</span>
      </div>
      <div  v-bind:class=" {dropdownunvisible:undisplay, dropdownvisible:display}">
      <v-row align="center">
   
    <v-card
      class="mx-auto list"
      max-width="400"
      tile
    >
      <v-list
        :disabled="disabled"
        :dense="dense"
        :two-line="twoLine"
        :three-line="threeLine"
        :shaped="shaped"
        :flat="flat"
        :subheader="subheader"
        :sub-group="subGroup"
        :nav="nav"
        :avatar="avatar"
        :rounded="rounded"
      >
        <v-subheader>requests</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            @dblclick="go(msg._id)"
            @click="seen(msg._id)"
            v-for="(req, i) in requests"
            :key="i"
           
            :inactive="inactive"
          >
            <v-list-item-avatar >
            <v-img :src="req.requester.image ? req.requester.image: require('../../public/default-image.png')" alt=""></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
             <v-list-item-subtitle>
               <v-btn :disabled="confirmed" @click="Confirm(req.requester._id, req.recepient._id, req._id)">confirm</v-btn>
               <v-btn :disabled="deleted" @click="Delete(req._id)">delete</v-btn>
             </v-list-item-subtitle>
               <v-list-item-subtitle v-if="twoLine || threeLine" v-html="'At ' + req.updatedAt.replace('T','').split('.')[0]"> </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-row>
     
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import userApi from '../api/user'
export default {
  name: "Requests",
props:{
  requests:{
    type:Array,

}},
  data: () => ({
   
      disabled: false,
      dense: false,
      twoLine: true,
      threeLine: false,
      shaped: false,
      flat: false,
      subheader: false,
      inactive: true,
      subGroup: true,
      nav: true,
      avatar: true,
      rounded: true,
      confirmed:false,
      deleted:false,
      undisplay: true,
      display:false
    }),
  // computed:{
  //   styling: function(){
  //     return {
   //       display: visible,
  //   },
  //   }
  // },
  created(){
     this.socket = io("http://localhost:3000");
     console.log(this)
  },
computed:{
  filteredMsgs(){
    const fltrdMsgs=this.$store.getters.getMsgs.filter(msg => msg.seen !==true)
   // console.log(fltrdMsgs)
    return fltrdMsgs;
  }
},
  methods: {
    onclick() {
      this.undisplay=!this.undisplay
      this.display= !this.display;
      console.log(this.display,this.undisplay)
    },
    go(id){
      console.log('double clicked')
      this.$router.push(`/texts/${id}`);
      
    },
    seen(id){
      console.log(id)
 userApi.seenMessage(id);
    },
    confirm(requester, recepient,_id){

      this.socket.emit("confirm-request", { requester, recepient})
      this.confirmed= true;
      this.$emit('remove-request',{_id})


    },
    Delete(_id){
  this.socket.emit("delete-request", {_id})
  this.deleted=true;
this.$emit('remove-request',{_id})

    },
  },
};
</script>

<style scoped>
.dropbtn {

  color: rgb(73, 102, 233);
 


  font-size: 16px;
  border: none;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  
}

/* Dropdown Content (Hidden by Default) */
.dropdownunvisible {
 
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdownvisible {
  display: block;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  position:absolute;
}
.circle{
   height: 10rem;
  width: 10rem;
  background-color: red;
  border-radius: 50% ;
  text-align: center;
  color: white;
}
.list{
  position: absolute;
  top: 1rem;
  right: 1rem;

}
</style>
