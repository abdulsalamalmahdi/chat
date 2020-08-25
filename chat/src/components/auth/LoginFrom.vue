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
    <v-card v-if="serverError">
      <v-alert class="alert" color="red" type="error">
        {{ erverError }}</v-alert
      >
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      serverError: "",

      loading: false,
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

      this.$store
        .dispatch("retrieveToken", opts)
        .then((res) => {
         console.log(res);
          if (res.status === 200) {
             
            this.loading = false, 
            this.$router.push("/profile");
          }
        })
        .catch((err) => {
          this.loading = false;
          this.serverError = err.response.data;
          this.successMessage = "";
        });
    },
  },
};
</script>

<style scoped>
.alert {
  margin: 3rem;
  width: 25rem;
  align-self: center;
}
</style>
