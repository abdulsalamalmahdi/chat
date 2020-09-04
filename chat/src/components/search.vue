<template>
  <div >
    <v-app id="inspire">
      <v-card class="son">
       <template>
  <v-container fluid>
    <v-row>
    <v-text-field v-model="val" v-on:input="look" placeholder="Search" ></v-text-field>
   <v-card
    class=" autoComplete"
  >
   

    <v-list three-line>
      <template v-for="(item) in items">
        <!-- <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader> -->
<!-- 
        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider> -->

        <v-list-item
        class="item"
          :key="item._id"
          @click="go(item._id)"
        >
          <v-list-item-avatar>
            <v-img :src="item.image ? item.image: require('../../public/default-image.png')"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.first_name"></v-list-item-title>
            <v-list-item-subtitle v-html="item.last_name"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
    </v-row>
  </v-container>
</template>
      
      </v-card>
    </v-app>
  </div>
</template>

<script>
//let self=this;
export default {
  name: "Search",
  data() {
    return {
      descriptionLimit: 60,
      items: [],
      count:'',
      isLoading: false,
      model: null,
      search: null,
      val:"",
    };
  },
  props:{
   user_id:{
     type:String
   }
  },
  methods:{
    look(){
      console.log(this.val)
      if(this.val){
        this.$store.dispatch('retrieveUsers').then(res=>{
      
     const filtered= res.data.filter(user=> user['first_name'].toLowerCase().includes(this.val.toLowerCase()));
    //  const index= filtered.find(user=>{
    //     user._id === this.user_id  
    //     })
    //     console.log(index)
    //     console.log(index)
    //  const excludeMe = filtered.indexOf(index)
    //  filtered.splice(excludeMe,1)
    //  console.log(excludeMe)
    
     console.log(filtered)
     this.items= filtered;
    
    })
    .catch(err=> console.log(err))
      }else{
        this.items=[];
      }
   },
   go(_id){
this.$router.push(`/${_id}`)
this.$emit('unShow')
this.val=""
   }
  }

};
</script>
<style  scoped>
#inspire{
width: 300px;
height: 14vh;
z-index: 6000;


}
.son{
    top: 2rem;
}
.autoComplete{
  width: 100%;
}
.item{
  height: 2rem;
}

</style>