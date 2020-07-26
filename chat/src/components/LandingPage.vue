<template>
  <v-app>
    
    <v-main>
     
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>

import HelloWorld from './HelloWorld';

export default {
  name: 'LandingPage',

  components: {
    HelloWorld,
   
  },

  data: () => ({
    //
  }),
};
</script>