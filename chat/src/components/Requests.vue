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
      max-width="600"
      tile
    >
      <v-list
        :disabled="disabled"
        :dense="dense"
        
        :shaped="shaped"
        :flat="flat"
        subheader
        :sub-group="subGroup"
        :nav="nav"
        :avatar="avatar"
        :rounded="rounded"
      >
      <v-subheader>Friends Requests</v-subheader>
        <v-list-item class="list_item" color="primary">
          <v-list-item
            @dblclick="go(msg._id)"
            @click="seen(msg._id)"
            v-for="(req, i) in requests"
            :key="i"
           
            :inactive="inactive"
          >
          <v-row>
          
               <v-list-item-avatar  >
            <v-img :src="req.requester.image ? req.requester.image: require('../../public/default-image.png')" alt=""></v-img>
            </v-list-item-avatar>
          
            <v-col class="details">
              
                 <v-list-item-title v-text="req.requester.first_name+ ' ' + req.requester.last_name"></v-list-item-title>
                 <v-list-item class="time" v-if="twoLine || threeLine" v-html="'At ' + req.updatedAt.replace('T','').split('.')[0]"> </v-list-item>

                 
  
            </v-col>
            <div class="controls">
             
               <v-btn :disabled="confirmed" @click="confirm(req.requester._id, req.recepient._id)">confirm</v-btn>
               <v-btn :disabled="deleted" @click="deleteIt(req._id)">delete</v-btn>
             
             
            </div>
          </v-row>
           
          
              <!-- <v-list-item class="bla" v-html="kdjfksjfdlkj">
              
             </v-list-item> -->
             
             
          
          </v-list-item>
  
          

        </v-list-item>
        
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
     this.socket.emit('connection', {data:'connection'})
    
   
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
    confirm(requester, recepient){
console.log(requester, recepient)
      this.socket.emit("confirm-request", { requester, recepient})
      this.confirmed= true;
    


    },
    deleteIt(_id){
  this.socket.emit("delete-request", {_id})
  this.deleted=true;
//this.$emit('remove-request',{_id})

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
  left: -12rem;
  width: 400px;
  background: rgb(229, 237, 240);

}

 
.details{
  width: 70%;
  font-size: 1em;
 padding: 0;
 margin: 0;
 left: 5rem;
  }
  .avatar{
    width: 10px;
    height: 45px;
    background: yellow;
    border: 1px solid black;
  }
  img{
    border: 1px solid black;
    width: 45px;
    height: 45px;
  }
  .controls{
    margin: 0;
    padding: 0;
    left: 1rem;
  
  }
  button :hover{
    background: #c7c0c0;
  }
  .time{
    font-size: 10px;
  }
  
</style>
