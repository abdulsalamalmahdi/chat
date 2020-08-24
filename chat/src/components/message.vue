<template>
    <div >
        message template 
        <h1>this is : {{id}}</h1>
        <v-card >
           
         
        <ul v-for="(msg, i) in messages"
        :key="i">
        
       
<li>
    <p>{{msg.text}}</p>
</li>
        </ul>
        </v-card>

        
  <form>
   
    
    <v-select
      v-model="text"
      :items="items"
      :error-messages="selectErrors"
      label="Item"
      required
      @change="$v.select.$touch()"
      @blur="$v.select.$touch()"
    ></v-select>
   
    <v-btn @click="submit">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </form>

        
    </div>
</template>
<script>
export default {
    name:'message',
  data(){
     
      return {
          id: this.$route.params._id,
          messages:[],
          text:''
          
      }
 
  },
  mounted:async function(){
          this.$store.dispatch('retrieveUser')
          console.log(this.$store.getters.getMsgs)
          this.messages= this.$store.getters.getMsgs;
      
  },
  methods:{
       submit(){
           
       }
  }
}

</script>