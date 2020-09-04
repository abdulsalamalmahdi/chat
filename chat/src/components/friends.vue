
<template>
  <v-card 
   v-on:scroll.native="handleScroll"
  id="card"
    class="friends mx-auto"
    max-width="400"
  >
    <v-card-title id="title" :class="this.scrollPosition ? 'sticky':''">
    Friends
     
    </v-card-title>
 <v-spacer></v-spacer>
   
        <template  v-if="friends.length > 0">
        <v-list
         
         v-for="friend in friends"
         :key="friend._id"
        class="ul"
        >
       
           <v-list-item class="item" >
          <v-list-item-avatar>
            <v-avatar
             
            >
              <v-img :src="friend.image ? friend.image: require('../../public/default-image.png')"></v-img>
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-on:click="open_popup(friend._id)">{{ friend.first_name + " " + friend.last_name }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>
       
         <v-divider></v-divider>
        </v-list>
        
      </template>
  

  </v-card>
</template>

<script>

  export default {
    name:'Friends',

    props:{
      friends:{
        type: Array,
      },
    },
    created: async function(){
       
    },
    data(){
      return{
       scrollPosition:null,
      }
    },
    methods:{
    open_popup(id){
      console.log(id)
      this.$emit('openPopup',id)
    },
    handleScroll(){
      console.log(event.target.offsetHeight)
      this.scrollPosition= event.target.offsetHeight
    }
     
    }
  }
</script> 
<style scoped>

#title{
  background: rgb(144, 185, 212);
  position: sticky;
  width: 400px;
  z-index: 4000;
  }
.friends{
  position: relative;
   height:300px;
  overflow-y: auto;
  z-index: -1;
}
.title{
 
}
.item{
  margin: 0;
}
.item:hover{
 background-color: rgb(210, 227, 235);
}
.sticky {
  position: fixed;
  top: 0;
  width: 100%
}
</style>