<template>
  <v-app>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-title>
        <h1 class="dispaly-1">Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            label="email"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            label="password"
            v-model="password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn @click.prevent="submit" color="info">Login</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="status" >
       <v-alert class="alert"  color="red" type="error" > {{status}}</v-alert>
    </v-card>
   
  </v-app>
</template>

<script>

import userApi from "../../api/user";


export default {
  name: "LoginForm",
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      status:null,
    };
  },
  methods: {
    submit() {
      const email = this.email;
      const password = this.password;

      const opts = {
        email,
        password,
      };
      userApi
        .login(opts)
        .then((results) => {
          
          const authenticatedUser = results.data.user;
          const user_token= JSON.stringify(results.data.token)
          localStorage.setItem('user_token', user_token);
         
             console.log(authenticatedUser)
          if (authenticatedUser) {
            


            this.$store.dispatch(
              "setAuthenticatedUserAction",
              authenticatedUser
            );
            localStorage.setItem(
              "user-token",
              JSON.stringify(authenticatedUser.token)
            );

            this.$router.push("/Profile");
            console.log(document.cookie);

            this.$forceUpdate();
          }
          return results;
        })
        .catch((err) => {
          
          this.status= err.response.data;
         
        });

      //  const authenticatedUser=  JSON.parse(localStorage.getItem("authenticatedUser"))
    },
  },
};
</script>

<style scoped>
.alert{
  margin: 3rem;
  width: 25rem;
  align-self: center;
}
</style>
